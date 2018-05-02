const webcontent = module.exports = {
  init,
  send,
  show,
  toggleDevTools,
  win: null
}

const electron = require('electron')

const config = require('../../config')

function init () {
  const win = webcontent.win = new electron.BrowserWindow({
    backgroundColor: '#1E1E1E',
    backgroundThrottling: false, // do not throttle animations/timers when page is background
    center: true,
    fullscreen: false,
    fullscreenable: false,
    height: 150,
    maximizable: false,
    minimizable: false,
    resizable: false,
    show: false,
    skipTaskbar: true,
    title: 'webcontent-hidden-window',
    useContentSize: true,
    width: 150
  })

  win.loadURL(config.WINDOW_WEBCONTENT)

  // Prevent killing the WebContent process
  win.on('close', function (e) {
    if (electron.app.isQuitting) {
      return
    }
    e.preventDefault()
    win.hide()
  })
}

function show () {
  if (!webcontent.win) return
  webcontent.win.show()
}

function send (...args) {
  if (!webcontent.win) return
  webcontent.win.send(...args)
}

function toggleDevTools () {
  if (!webcontent.win) return
  if (webcontent.win.webContents.isDevToolsOpened()) {
    webcontent.win.webContents.closeDevTools()
    webcontent.win.hide()
  } else {
    webcontent.win.webContents.openDevTools({ detach: true })
  }
}
