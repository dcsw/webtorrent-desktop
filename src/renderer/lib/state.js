const appConfig = require('application-config')('Electron-Generic-Content-App')
const path = require('path')
const {EventEmitter} = require('events')

const config = require('../../config')

const SAVE_DEBOUNCE_INTERVAL = 1000

appConfig.filePath = path.join(config.CONFIG_PATH, 'config.json')

const State = module.exports = Object.assign(new EventEmitter(), {
  getDefaultPlayState,
  load,
  // state.save() calls are rate-limited. Use state.saveImmediate() to skip limit.
  save: function () {
    // Perf optimization: Lazy-require debounce (and it's dependencies)
    const debounce = require('debounce')
    // After first State.save() invokation, future calls go straight to the
    // debounced function
    State.save = debounce(saveImmediate, SAVE_DEBOUNCE_INTERVAL)
    State.save(...arguments)
  },
  saveImmediate
})

function getDefaultState () {
  const LocationHistory = require('location-history')

  return {
    /*
     * Temporary state disappears once the program exits.
     * It can contain complex objects like open connections, etc.
     */
    client: null, /* the lient */
    server: null, /* local server */
    prev: { /* used for state diffing in updateElectron() */
      title: null,
      progress: -1,
      badge: null
    },
    location: new LocationHistory(),
    window: {
      bounds: null, /* {x, y, width, height } */
      isFocused: true,
      isFullScreen: false,
      title: config.APP_WINDOW_TITLE
    },
    selectedInfoHash: null, /* the content we've selected to view details. see state.contents */
    playing: getDefaultPlayState(), /* the media (audio or video) that we're currently playing */
    devices: {}, /* playback devices like Chromecast and AppleTV */
    dock: {
      badge: 0,
      progress: 0
    },
    modal: null, /* modal popover */
    errors: [], /* user-facing errors */
    nextContentKey: 1, /* identify contents for IPC between the main and webcontent windows */

    /*
     * Saved state is read from and written to a file every time the app runs.
     * It should be simple and minimal and must be JSON.
     * It must never contain absolute paths since we have a portable app.
     *
     * Config path:
     *
     * Mac                  ~/Library/Application Support/Electron-Generic-Content-App/config.json
     * Linux (XDG)          $XDG_CONFIG_HOME/Electron-Generic-Content-App/config.json
     * Linux (Legacy)       ~/.config/Electron-Generic-Content-App/config.json
     * Windows (> Vista)    %LOCALAPPDATA%/Electron-Generic-Content-App/config.json
     * Windows (XP, 2000)   %USERPROFILE%/Local Settings/Application Data/Electron-Generic-Content-App/config.json
     *
     * Also accessible via `require('application-config')('Electron-Generic-Content-App').filePath`
     */
    saved: {},

    /*
     * Getters, for convenience
     */
    getPlayingContentSummary,
    getPlayingFileSummary,
    getExternalPlayerName,
    shouldHidePlayerControls
  }
}

/* Whenever we stop playing video or audio, here's what we reset state.playing to */
function getDefaultPlayState () {
  return {
    infoHash: null, /* the info hash of the content we're playing */
    fileIndex: null, /* the zero-based index within the content */
    location: 'local', /* 'local', 'chromecast', 'airplay' */
    type: null, /* 'audio' or 'video', could be 'other' if ever support eg streaming to VLC */
    currentTime: 0, /* seconds */
    duration: 1, /* seconds */
    isReady: false,
    isPaused: true,
    isStalled: false,
    lastTimeUpdate: 0, /* Unix time in ms */
    mouseStationarySince: 0, /* Unix time in ms */
    playbackRate: 1,
    volume: 1,
    subtitles: {
      tracks: [], /* subtitle tracks, each {label, language, ...} */
      selectedIndex: -1, /* current subtitle track */
      showMenu: false /* popover menu, above the video */
    },
    aspectRatio: 0 /* aspect ratio of the video */
  }
}

/* If the saved state file doesn't exist yet, here's what we use instead */
function setupStateSaved (cb) {
  const cpFile = require('cp-file')
  const fs = require('fs')
  const parseContent = require('parse-torrent')
  const parallel = require('run-parallel')

  const saved = {
    prefs: {
      downloadPath: config.DEFAULT_DOWNLOAD_PATH,
      isFileHandler: false,
      openExternalPlayer: false,
      externalPlayerPath: null,
      startup: false,
      autoAddContents: false,
      contentsFolderPath: ''
    },
    contents: config.GENERIC_CONTENT_ITEMS.map(createContentObject),
    contentsToResume: [],
    version: config.APP_VERSION /* make sure we can upgrade gracefully later */
  }

  const tasks = []

  parallel(tasks, function (err) {
    if (err) return cb(err)
    cb(null, saved)
  })

  function createContentObject (t) {
    return {
      url: t.url,
      img: t.img,
      name: t.name,
      description: t.description,
      infoHash: t.infoHash
    }
  }
}

function getPlayingContentSummary () {
  const infoHash = this.playing.infoHash
  return this.saved.contents.find((x) => x.infoHash === infoHash)
}

function getPlayingFileSummary () {
  const contentSummary = this.getPlayingContentSummary()
  if (!contentSummary) return null
  return contentSummary.files[this.playing.fileIndex]
}

function getExternalPlayerName () {
  const playerPath = this.saved.prefs.externalPlayerPath
  if (!playerPath) return 'VLC'
  return path.basename(playerPath).split('.')[0]
}

function shouldHidePlayerControls () {
  return this.location.url() === 'player' &&
    this.playing.mouseStationarySince !== 0 &&
    new Date().getTime() - this.playing.mouseStationarySince > 2000 &&
    !this.playing.mouseInControls &&
    !this.playing.isPaused &&
    this.playing.location === 'local' &&
    this.playing.playbackRate === 1
}

function load (cb) {
  appConfig.read(function (err, saved) {
    if (err || !saved.version) {
      console.log('Missing config file: Creating new one')
      setupStateSaved(onSavedState)
    } else {
      onSavedState(null, saved)
    }
  })

  function onSavedState (err, saved) {
    if (err) return cb(err)
    const state = getDefaultState()
    state.saved = saved

    if (process.type === 'renderer') {
      // Perf optimization: Save require() calls in the main process
      const migrations = require('./migrations')
      migrations.run(state)
    }

    cb(null, state)
  }
}

// Write state.saved to the JSON state file
function saveImmediate (state, cb) {
  console.log('Saving state to ' + appConfig.filePath)

  // Clean up, so that we're not saving any pending state
  const copy = Object.assign({}, state.saved)
  // Remove contents pending addition to the list, where we haven't finished
  // reading the content file or file(s) to seed & don't have an infohash
  copy.contents = copy.contents
    .filter((x) => x.infoHash)
    .map(function (x) {
      const content = {}
      for (let key in x) {
        if (key === 'progress' || key === 'contentKey') {
          continue // Don't save progress info or key for the webcontent process
        }
        if (key === 'error') {
          continue // Don't save error states
        }
        content[key] = x[key]
      }
      return content
    })

  appConfig.write(copy, (err) => {
    if (err) console.error(err)
    else State.emit('stateSaved')
  })
}
