// TODO: clean out torrent-related code throughout here
// TODO: also arrange to save our data

// To keep the UI snappy, we run WebContent in its own hidden window, a separate
// process from the main window.
console.time('init')

const crypto = require('crypto')
const deepEqual = require('deep-equal')
const defaultAnnounceList = require('create-torrent').announceList
const electron = require('electron')
const fs = require('fs')
const mkdirp = require('mkdirp')
const musicmetadata = require('musicmetadata')
const networkAddress = require('network-address')
const path = require('path')
const WebContent = require('webtorrent')
const zeroFill = require('zero-fill')

const crashReporter = require('../crash-reporter')
const config = require('../config')
const {ContentKeyNotFoundError} = require('./lib/errors')
const contentPoster = require('./lib/content-poster')

// Report when the process crashes
crashReporter.init()

// Send & receive messages from the main window
const ipc = electron.ipcRenderer

// Force use of webcontent trackers on all contents
global.WEBCONTENT_ANNOUNCE = defaultAnnounceList
  .map((arr) => arr[0])
  .filter((url) => url.indexOf('wss://') === 0 || url.indexOf('ws://') === 0)

/**
 * WebContent version.
 */
const VERSION = require('../../package.json').version

/**
 * Version number in Azureus-style. Generated from major and minor semver version.
 * For example:
 *   '0.16.1' -> '0016'
 *   '1.2.5' -> '0102'
 */
const VERSION_STR = VERSION.match(/([0-9]+)/g)
  .slice(0, 2)
  .map((v) => zeroFill(2, v))
  .join('')

/**
 * Version prefix string (used in peer ID). WebContent uses the Azureus-style
 * encoding: '-', two characters for client id ('WW'), four ascii digits for version
 * number, '-', followed by random numbers.
 * For example:
 *   '-WW0102-'...
 */
const VERSION_PREFIX = '-WD' + VERSION_STR + '-'

/**
 * Generate an ephemeral peer ID each time.
 */
const PEER_ID = Buffer.from(VERSION_PREFIX + crypto.randomBytes(9).toString('base64'))

// Connect to the WebContent and BitContent networks. WebContent Desktop is a hybrid
// client, as explained here: https://webcontent.io/faq
let client = window.client = new WebContent({ peerId: PEER_ID })
client.contents = [];

// WebContent-to-HTTP streaming sever
let server = null

// Used for diffing, so we only send progress updates when necessary
let prevProgress = null

init()

function init () {
  listenToClientEvents()

  ipc.on('wt-start-playing-content', (e, contentKey, contentID, path, fileModtimes, selections) =>
    startPlayingContent(contentKey, contentID, path, fileModtimes, selections))
  ipc.on('wt-stop-playing-content', (e, infoHash) =>
    stopPlayingContent(infoHash))
  ipc.on('wt-create-content', (e, contentKey, options) =>
    createContent(contentKey, options))
  ipc.on('wt-save-content-file', (e, contentKey) =>
    saveContentFile(contentKey))
  ipc.on('wt-generate-content-poster', (e, contentKey) =>
    generateContentPoster(contentKey))
  ipc.on('wt-get-audio-metadata', (e, infoHash, index) =>
    getAudioMetadata(infoHash, index))
  ipc.on('wt-start-server', (e, infoHash) =>
    startServer(infoHash))
  ipc.on('wt-stop-server', (e) =>
    stopServer())
  ipc.on('wt-select-files', (e, infoHash, selections) =>
    selectFiles(infoHash, selections))

  ipc.send('ipcReadyContentPlayer')

  window.addEventListener('error', (e) =>
    ipc.send('wt-uncaught-error', {message: e.error.message, stack: e.error.stack}),
    true)

  setInterval(updateContentProgress, 1000)
  console.timeEnd('init')
}

function listenToClientEvents () {
  client.on('warning', (err) => ipc.send('wt-warning', null, err.message))
  client.on('error', (err) => ipc.send('wt-error', null, err.message))
}

// Starts a given ContentID, which can be an infohash, magnet URI, etc.
// Returns a WebContent object. See https://git.io/vik9M
function startPlayingContent (contentKey, contentID, path, fileModtimes, selections) {
  console.log('starting content %s: %s', contentKey, contentID)

  // const content = client.add(contentID, {
  //   path: path,
  //   fileModtimes: fileModtimes
  // })
  // content.key = contentKey

  // // Listen for ready event, progress notifications, etc
  // addContentEvents(content)

  // // Only download the files the user wants, not necessarily all files
  // content.once('ready', () => selectFiles(content, selections))
  
}

function stopPlayingContent (infoHash) {
  console.log('--- STOP CONTENTING: ', infoHash)
  const content = client.get(infoHash)
  if (content) content.destroy()
}

// Create a new content, start seeding
function createContent (contentKey, options) {
  console.log('creating content', contentKey, options)
  // const paths = options.files.map((f) => f.path)
  // const content = client.seed(paths, options)
  // content.key = contentKey
  // addContentEvents(content)
  // ipc.send('wt-new-content')
}

function addContentEvents (content) {
  content.on('warning', (err) =>
    ipc.send('wt-warning', content.key, err.message))
  content.on('error', (err) =>
    ipc.send('wt-error', content.key, err.message))
  content.on('infoHash', () =>
    ipc.send('wt-infohash', content.key, content.infoHash))
  content.on('metadata', contentMetadata)
  content.on('ready', contentReady)
  content.on('done', contentDone)

  function contentMetadata () {
    const info = getContentInfo(content)
    ipc.send('wt-metadata', content.key, info)

    updateContentProgress()
  }

  function contentReady () {
    const info = getContentInfo(content)
    ipc.send('wt-ready', content.key, info)
    ipc.send('wt-ready-' + content.infoHash, content.key, info)

    updateContentProgress()
  }

  function contentDone () {
    const info = getContentInfo(content)
    ipc.send('wt-done', content.key, info)

    updateContentProgress()

    content.getFileModtimes(function (err, fileModtimes) {
      if (err) return onError(err)
      ipc.send('wt-file-modtimes', content.key, fileModtimes)
    })
  }
}

// Produces a JSON saveable summary of a content
function getContentInfo (content) {
  return {
    infoHash: content.infoHash,
    magnetURI: content.magnetURI,
    name: content.name,
    path: content.path,
    files: content.files.map(getContentFileInfo),
    bytesReceived: content.received
  }
}

// Produces a JSON saveable summary of a file in a content
function getContentFileInfo (file) {
  return {
    name: file.name,
    length: file.length,
    path: file.path
  }
}

// Every time we resolve a magnet URI, save the content file so that we can use
// it on next startup. Starting with the full content metadata will be faster
// than re-fetching it from peers using ut_metadata.
function saveContentFile (contentKey) {
  const content = getContent(contentKey)
  const contentPath = path.join(config.CONTENT_PATH, content.infoHash + '.content')

  fs.access(contentPath, fs.constants.R_OK, function (err) {
    const fileName = content.infoHash + '.content'
    if (!err) {
      // We've already saved the file
      return ipc.send('wt-file-saved', contentKey, fileName)
    }

    // Otherwise, save the .content file, under the app config folder
    mkdirp(config.CONTENT_PATH, function (_) {
      fs.writeFile(contentPath, content.contentFile, function (err) {
        if (err) return console.log('error saving content file %s: %o', contentPath, err)
        console.log('saved content file %s', contentPath)
        return ipc.send('wt-file-saved', contentKey, fileName)
      })
    })
  })
}

// Save a JPG that represents a content.
// Auto chooses either a frame from a video file, an content, etc
function generateContentPoster (contentKey) {
  const content = getContent(contentKey)
  contentPoster(content, function (err, buf, extension) {
    if (err) return console.log('error generating poster: %o', err)
    // save it for next time
    mkdirp(config.POSTER_PATH, function (err) {
      if (err) return console.log('error creating poster dir: %o', err)
      const posterFileName = content.infoHash + extension
      const posterFilePath = path.join(config.POSTER_PATH, posterFileName)
      fs.writeFile(posterFilePath, buf, function (err) {
        if (err) return console.log('error saving poster: %o', err)
        // show the poster
        ipc.send('wt-poster', contentKey, posterFileName)
      })
    })
  })
}

function updateContentProgress () {
  const progress = getContentProgress()
  // TODO: diff content-by-content, not once for the whole update
  if (prevProgress && deepEqual(progress, prevProgress, {strict: true})) {
    return /* don't send heavy object if it hasn't changed */
  }
  ipc.send('wt-progress', progress)
  prevProgress = progress
}

function getContentProgress () {
  // First, track overall progress
  const progress = client.progress
  const hasActiveContents = client.contents.some(function (content) {
    return content.progress !== 1
  })

  // Track progress for every file in each content
  // TODO: ideally this would be tracked by WebContent, which could do it
  // more efficiently than looping over content.bitfield
  const contentProg = client.contents.map(function (content) {
    const fileProg = content.files && content.files.map(function (file, index) {
      const numPieces = file._endPiece - file._startPiece + 1
      let numPiecesPresent = 0
      for (let piece = file._startPiece; piece <= file._endPiece; piece++) {
        if (content.bitfield.get(piece)) numPiecesPresent++
      }
      return {
        startPiece: file._startPiece,
        endPiece: file._endPiece,
        numPieces,
        numPiecesPresent
      }
    })
    return {
      contentKey: content.key,
      ready: content.ready,
      progress: content.progress,
      downloaded: content.downloaded,
      downloadSpeed: content.downloadSpeed,
      uploadSpeed: content.uploadSpeed,
      numPeers: content.numPeers,
      length: content.length,
      bitfield: content.bitfield,
      files: fileProg
    }
  })

  return {
    contents: contentProg,
    progress,
    hasActiveContents
  }
}

function startServer (infoHash) {
  // const content = client.get(infoHash)
  // if (content.ready) startServerFromReadyContent(content)
  // else content.once('ready', () => startServerFromReadyContent(content))
}

// function startServerFromReadyContent (content, cb) {
//   if (server) return

//   // start the streaming content-to-http server
//   server = content.createServer()
//   server.listen(0, function () {
//     const port = server.address().port
//     const urlSuffix = ':' + port
//     const info = {
//       contentKey: content.key,
//       localURL: 'http://localhost' + urlSuffix,
//       networkURL: 'http://' + networkAddress() + urlSuffix
//     }

//     ipc.send('wt-server-running', info)
//     ipc.send('wt-server-' + content.infoHash, info)
//   })
// }

function stopServer () {
  if (!server) return
  server.destroy()
  server = null
}

function getAudioMetadata (infoHash, index) {
  const content = client.get(infoHash)
  const file = content.files[index]
  musicmetadata(file.createReadStream(), function (err, info) {
    if (err) return console.log('error getting audio metadata for ' + infoHash + ':' + index, err)
    const { artist, album, albumartist, title, year, track, disk, genre } = info
    const importantInfo = { artist, album, albumartist, title, year, track, disk, genre }
    console.log('got audio metadata for %s: %o', file.name, importantInfo)
    ipc.send('wt-audio-metadata', infoHash, index, importantInfo)
  })
}

function selectFiles (contentOrInfoHash, selections) {
  // Get the content object
  let content
  if (typeof contentOrInfoHash === 'string') {
    content = client.get(contentOrInfoHash)
  } else {
    content = contentOrInfoHash
  }
  if (!content) {
    throw new Error('selectFiles: missing content ' + contentOrInfoHash)
  }

  // Selections not specified?
  // Load all files. We still need to replace the default whole-content
  // selection with individual selections for each file, so we can
  // select/deselect files later on
  if (!selections) {
    selections = content.files.map((x) => true)
  }

  // Selections specified incorrectly?
  if (selections.length !== content.files.length) {
    throw new Error('got ' + selections.length + ' file selections, ' +
      'but the content contains ' + content.files.length + ' files')
  }

  // Remove default selection (whole content)
  content.deselect(0, content.pieces.length - 1, false)

  // Add selections (individual files)
  for (let i = 0; i < selections.length; i++) {
    const file = content.files[i]
    if (selections[i]) {
      file.select()
    } else {
      console.log('deselecting file ' + i + ' of content ' + content.name)
      file.deselect()
    }
  }
}

// Gets a WebContent handle by contentKey
// Throws an Error if we're not currently contenting anything w/ that key
function getContent (contentKey) {
  const ret = client.contents.find((x) => x.key === contentKey)
  if (!ret) throw new ContentKeyNotFoundError(contentKey)
  return ret
}

function onError (err) {
  console.log(err)
}

// TODO: remove this once the following bugs are fixed:
// https://bugs.chromium.org/p/chromium/issues/detail?id=490143
// https://github.com/electron/electron/issues/7212
window.testOfflineMode = function () {
  console.log('Test, going OFFLINE')
  client = window.client = new WebContent({
    peerId: PEER_ID,
    tracker: false,
    dht: false,
    webSeeds: false
  })
  listenToClientEvents()
}
