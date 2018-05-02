const chokidar = require('chokidar')
const log = require('./log')

class FolderWatcher {
  constructor ({window, state}) {
    this.window = window
    this.state = state
    this.contentsFolderPath = null
    this.watching = false
  }

  isEnabled () {
    return this.state.saved.prefs.autoAddContents
  }

  start () {
    // Stop watching previous folder before
    // start watching a new one.
    if (this.watching) this.stop()

    const contentsFolderPath = this.state.saved.prefs.contentsFolderPath
    this.contentsFolderPath = contentsFolderPath
    if (!contentsFolderPath) return

    const glob = `${contentsFolderPath}/**/*.content`
    log('Folder Watcher: watching: ', glob)

    const options = {
      ignoreInitial: true,
      awaitWriteFinish: true
    }
    this.watcher = chokidar.watch(glob, options)
    this.watcher
      .on('add', (path) => {
        log('Folder Watcher: added content: ', path)
        this.window.dispatch('addContent', path)
      })

    this.watching = true
  }

  stop () {
    log('Folder Watcher: stop.')
    if (!this.watching) return
    this.watcher.close()
    this.watching = false
  }
}

module.exports = FolderWatcher
