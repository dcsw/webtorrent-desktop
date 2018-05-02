module.exports = {
  openSeedFile,
  openSeedDirectory,
  openContentFile,
  openContentAddress,
  openFiles
}

const electron = require('electron')

const log = require('./log')
const windows = require('./windows')

/**
 * Show open dialog to create a single-file content.
 */
function openSeedFile () {
  if (!windows.main.win) return
  log('openSeedFile')
  const opts = {
    title: 'Select a file for the content.',
    properties: [ 'openFile' ]
  }
  showOpenSeed(opts)
}

/*
 * Show open dialog to create a single-file or single-directory content. On
 * Windows and Linux, open dialogs are for files *or* directories only, not both,
 * so this function shows a directory dialog on those platforms.
 */
function openSeedDirectory () {
  if (!windows.main.win) return
  log('openSeedDirectory')
  const opts = process.platform === 'darwin'
    ? {
      title: 'Select a file or folder for the content.',
      properties: [ 'openFile', 'openDirectory' ]
    }
    : {
      title: 'Select a folder for the content.',
      properties: [ 'openDirectory' ]
    }
  showOpenSeed(opts)
}

/*
 * Show flexible open dialog that supports selecting .content files to add, or
 * a file or folder to create a single-file or single-directory content.
 */
function openFiles () {
  if (!windows.main.win) return
  log('openFiles')
  const opts = process.platform === 'darwin'
    ? {
      title: 'Select a file or folder to add.',
      properties: [ 'openFile', 'openDirectory' ]
    }
    : {
      title: 'Select a file to add.',
      properties: [ 'openFile' ]
    }
  setTitle(opts.title)
  electron.dialog.showOpenDialog(windows.main.win, opts, function (selectedPaths) {
    resetTitle()
    if (!Array.isArray(selectedPaths)) return
    windows.main.dispatch('onOpen', selectedPaths)
  })
}

/*
 * Show open dialog to open a .content file.
 */
function openContentFile () {
  if (!windows.main.win) return
  log('openContentFile')
  const opts = {
    title: 'Select a .content file.',
    filters: [{ name: 'Content Files', extensions: ['content'] }],
    properties: [ 'openFile', 'multiSelections' ]
  }
  setTitle(opts.title)
  electron.dialog.showOpenDialog(windows.main.win, opts, function (selectedPaths) {
    resetTitle()
    if (!Array.isArray(selectedPaths)) return
    selectedPaths.forEach(function (selectedPath) {
      windows.main.dispatch('addContent', selectedPath)
    })
  })
}

/*
 * Show modal dialog to open a content URL (magnet uri, http content link, etc.)
 */
function openContentAddress () {
  log('openContentAddress')
  windows.main.dispatch('openContentAddress')
}

/**
 * Dialogs on do not show a title on Mac, so the window title is used instead.
 */
function setTitle (title) {
  if (process.platform === 'darwin') {
    windows.main.dispatch('setTitle', title)
  }
}

function resetTitle () {
  windows.main.dispatch('resetTitle')
}

/**
 * Pops up an Open File dialog with the given options.
 * After the user selects files / folders, shows the Create Content page.
 */
function showOpenSeed (opts) {
  setTitle(opts.title)
  electron.dialog.showOpenDialog(windows.main.win, opts, function (selectedPaths) {
    resetTitle()
    if (!Array.isArray(selectedPaths)) return
    windows.main.dispatch('showCreateContent', selectedPaths)
  })
}
