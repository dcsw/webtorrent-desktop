const fs = require('fs')
const path = require('path')
const electron = require('electron')

const {dispatch} = require('../lib/dispatcher')
const {ContentKeyNotFoundError} = require('../lib/errors')
const sound = require('../lib/sound')
const ContentSummary = require('../lib/content-summary')

const ipcRenderer = electron.ipcRenderer

const instantIoRegex = /^(https:\/\/)?instant\.io\/#/

// Controls the content list: creating, adding, deleting, & manipulating contents
module.exports = class ContentListController {
  constructor (state) {
    this.state = state
  }

  // Adds a content to the list, starts downloading/seeding.
  // ContentID can be a magnet URI, infohash, or content file: https://git.io/vik9M
  addContent (contentId) {
    // if (contentId.path) {
    //   // Use path string instead of W3C File object
    //   contentId = contentId.path
    // }
    if (contentId.url) {
      // Use path string instead of W3C File object
      contentId = contentId.url
    }

    // // Trim extra spaces off pasted magnet links
    // if (typeof contentId === 'string') {
    //   contentId = contentId.trim()
    // }

    // // Allow a instant.io link to be pasted
    // if (typeof contentId === 'string' && instantIoRegex.test(contentId)) {
    //   contentId = contentId.slice(contentId.indexOf('#') + 1)
    // }

    const contentKey = this.state.nextContentKey++
    const path = this.state.saved.prefs.downloadPath

    ipcRenderer.send('wt-start-playing-content', contentKey, contentId, path)

    dispatch('backToList')
  }

  // Shows the Create Content page with options to seed a given file or folder
  showCreateContent (files) {
    // You can only create contents from the home screen.
    if (this.state.location.url() !== 'home') {
      return dispatch('error', 'Please go back to the content list before creating a new content.')
    }

    // Files will either be an array of file objects, which we can send directly
    // to the create-content screen
    if (files.length === 0 || typeof files[0] !== 'string') {
      this.state.location.go({
        url: 'create-content',
        files: files,
        setup: (cb) => {
          this.state.window.title = 'Create New Content'
          cb(null)
        }
      })
      return
    }

    // ... or it will be an array of mixed file and folder paths. We have to walk
    // through all the folders and find the files
    findFilesRecursive(files, (allFiles) => this.showCreateContent(allFiles))
  }

  // Creates a new content and start seeeding
  createContent (options) {
    const state = this.state
    const contentKey = state.nextContentKey++
    ipcRenderer.send('wt-create-content', contentKey, options)
    state.location.cancel()
  }

  // Starts downloading and/or seeding a given contentSummary.
  startPlayingContentSummary (contentKey) {
    const s = ContentSummary.getByKey(this.state, contentKey)
    if (!s) throw new ContentKeyNotFoundError(contentKey)

    // New content: give it a path
    if (!s.path) {
      // Use Downloads folder by default
      s.path = this.state.saved.prefs.downloadPath
      return start()
    }

    const fileOrFolder = ContentSummary.getFileOrFolder(s)

    // New content: metadata not yet received
    if (!fileOrFolder) return start()

    // Existing content: check that the path is still there
    fs.stat(fileOrFolder, function (err) {
      if (err) {
        s.error = 'path-missing'
        dispatch('backToList')
        return
      }
      start()
    })

    function start () {
      ipcRenderer.send('wt-start-playing-content',
        s.contentKey,
        ContentSummary.getContentId(s),
        s.path,
        s.fileModtimes,
        s.selections)
    }
  }

  // TODO: use contentKey, not infoHash
  toggleContent (infoHash) {
    const contentSummary = ContentSummary.getByKey(this.state, infoHash)
    if (contentSummary.status === 'paused') {
      contentSummary.status = 'new'
      this.startPlayingContentSummary(contentSummary.contentKey)
      sound.play('ENABLE')
      return
    }

    this.pauseContent(contentSummary, true)
  }

  pauseAllContents () {
    this.state.saved.contents.forEach((contentSummary) => {
      if (contentSummary.status === 'downloading' ||
          contentSummary.status === 'seeding') {
        contentSummary.status = 'paused'
        ipcRenderer.send('wt-stop-playing-content', contentSummary.infoHash)
      }
    })
    sound.play('DISABLE')
  }

  resumeAllContents () {
    this.state.saved.contents.forEach((contentSummary) => {
      if (contentSummary.status === 'paused') {
        contentSummary.status = 'downloading'
        this.startPlayingContentSummary(contentSummary.contentKey)
      }
    })
    sound.play('ENABLE')
  }

  pauseContent (contentSummary, playSound) {
    contentSummary.status = 'paused'
    ipcRenderer.send('wt-stop-playing-content', contentSummary.infoHash)

    if (playSound) sound.play('DISABLE')
  }

  prioritizeContent (infoHash) {
    this.state.saved.contents
    .filter((content) => { // We're interested in active contents only.
      return (['downloading', 'seeding'].indexOf(content.status) !== -1)
    })
    .map((content) => { // Pause all active contents except the one that started playing.
      if (infoHash === content.infoHash) return

      // Pause content without playing sounds.
      this.pauseContent(content, false)

      this.state.saved.contentsToResume.push(content.infoHash)
    })

    console.log('Playback Priority: paused contents: ', this.state.saved.contentsToResume)
  }

  resumePausedContents () {
    console.log('Playback Priority: resuming paused contents')
    this.state.saved.contentsToResume.map((infoHash) => {
      this.toggleContent(infoHash)
    })

    // reset paused contents
    this.state.saved.contentsToResume = []
  }

  toggleContentFile (infoHash, index) {
    const contentSummary = ContentSummary.getByKey(this.state, infoHash)
    contentSummary.selections[index] = !contentSummary.selections[index]

    // Let the WebContent process know to start or stop fetching that file
    if (contentSummary.status !== 'paused') {
      ipcRenderer.send('wt-select-files', infoHash, contentSummary.selections)
    }
  }

  confirmDeleteContent (infoHash, deleteData) {
    this.state.modal = {
      id: 'remove-content-modal',
      infoHash,
      deleteData
    }
  }

  // TODO: use contentKey, not infoHash
  deleteContent (infoHash, deleteData) {
    ipcRenderer.send('wt-stop-playing-content', infoHash)

    const index = this.state.saved.contents.findIndex((x) => x.infoHash === infoHash)

    if (index > -1) {
      const summary = this.state.saved.contents[index]

      // remove content and poster file
      deleteFile(ContentSummary.getContentPath(summary))
      deleteFile(ContentSummary.getPosterPath(summary))

      // optionally delete the content data
      if (deleteData) moveItemToTrash(summary)

      // remove content from saved list
      this.state.saved.contents.splice(index, 1)
      dispatch('stateSave')
    }

    // prevent user from going forward to a deleted content
    this.state.location.clearForward('player')
    sound.play('DELETE')
  }

  toggleSelectContent (infoHash) {
    if (this.state.selectedInfoHash === infoHash) {
      this.state.selectedInfoHash = null
    } else {
      this.state.selectedInfoHash = infoHash
    }
  }

  openContentContextMenu (infoHash) {
    const contentSummary = ContentSummary.getByKey(this.state, infoHash)
    const menu = new electron.remote.Menu()

    menu.append(new electron.remote.MenuItem({
      label: 'Remove From List',
      click: () => dispatch('confirmDeleteContent', contentSummary.infoHash, false)
    }))

    menu.append(new electron.remote.MenuItem({
      label: 'Remove Data File',
      click: () => dispatch('confirmDeleteContent', contentSummary.infoHash, true)
    }))

    menu.append(new electron.remote.MenuItem({
      type: 'separator'
    }))

    if (contentSummary.files) {
      menu.append(new electron.remote.MenuItem({
        label: process.platform === 'darwin' ? 'Show in Finder' : 'Show in Folder',
        click: () => showItemInFolder(contentSummary)
      }))
      menu.append(new electron.remote.MenuItem({
        type: 'separator'
      }))
    }

    menu.append(new electron.remote.MenuItem({
      label: 'Copy Magnet Link to Clipboard',
      click: () => electron.clipboard.writeText(contentSummary.magnetURI)
    }))

    menu.append(new electron.remote.MenuItem({
      label: 'Copy Instant.io Link to Clipboard',
      click: () => electron.clipboard.writeText(`https://instant.io/#${contentSummary.infoHash}`)
    }))

    menu.append(new electron.remote.MenuItem({
      label: 'Save Content File As...',
      click: () => dispatch('saveContentFileAs', contentSummary.contentKey),
      enabled: contentSummary.genericContentFileName != null
    }))

    menu.popup(electron.remote.getCurrentWindow())
  }

  // Takes a contentSummary or contentKey
  // Shows a Save File dialog, then saves the .content file wherever the user requests
  saveContentFileAs (contentKey) {
    const contentSummary = ContentSummary.getByKey(this.state, contentKey)
    if (!contentSummary) throw new Error('Missing contentKey: ' + contentKey)
    const downloadPath = this.state.saved.prefs.downloadPath
    const newFileName = path.parse(contentSummary.name).name + '.content'
    const win = electron.remote.getCurrentWindow()
    const opts = {
      title: 'Save Content File',
      defaultPath: path.join(downloadPath, newFileName),
      filters: [
        { name: 'Content Files', extensions: ['content'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }

    electron.remote.dialog.showSaveDialog(win, opts, function (savePath) {
      console.log('Saving content ' + contentKey + ' to ' + savePath)
      if (!savePath) return // They clicked Cancel
      const contentPath = ContentSummary.getContentPath(contentSummary)
      fs.readFile(contentPath, function (err, contentFile) {
        if (err) return dispatch('error', err)
        fs.writeFile(savePath, contentFile, function (err) {
          if (err) return dispatch('error', err)
        })
      })
    })
  }
}

// Recursively finds {name, path, size} for all files in a folder
// Calls `cb` on success, calls `onError` on failure
function findFilesRecursive (paths, cb_) {
  if (paths.length > 1) {
    let numComplete = 0
    let ret = []
    paths.forEach(function (path) {
      findFilesRecursive([path], function (fileObjs) {
        ret.push(...fileObjs)
        if (++numComplete === paths.length) {
          ret.sort((a, b) => a.path < b.path ? -1 : a.path > b.path)
          cb_(ret)
        }
      })
    })
    return
  }

  const fileOrFolder = paths[0]
  fs.stat(fileOrFolder, function (err, stat) {
    if (err) return dispatch('error', err)

    // Files: return name, path, and size
    if (!stat.isDirectory()) {
      const filePath = fileOrFolder
      return cb_([{
        name: path.basename(filePath),
        path: filePath,
        size: stat.size
      }])
    }

    // Folders: recurse, make a list of all the files
    const folderPath = fileOrFolder
    fs.readdir(folderPath, function (err, fileNames) {
      if (err) return dispatch('error', err)
      const paths = fileNames.map((fileName) => path.join(folderPath, fileName))
      findFilesRecursive(paths, cb_)
    })
  })
}

function deleteFile (path) {
  if (!path) return
  fs.unlink(path, function (err) {
    if (err) dispatch('error', err)
  })
}

// Delete all files in a content
function moveItemToTrash (contentSummary) {
  const filePath = ContentSummary.getFileOrFolder(contentSummary)
  if (filePath) ipcRenderer.send('moveItemToTrash', filePath)
}

function showItemInFolder (contentSummary) {
  ipcRenderer.send('showItemInFolder', ContentSummary.getFileOrFolder(contentSummary))
}
