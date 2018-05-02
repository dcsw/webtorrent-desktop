const path = require('path')
const ipcRenderer = require('electron').ipcRenderer

const ContentSummary = require('../lib/content-summary')
const sound = require('../lib/sound')
const {dispatch} = require('../lib/dispatcher')

module.exports = class ContentController {
  constructor (state) {
    this.state = state
  }

  contentInfoHash (contentKey, infoHash) {
    let contentSummary = this.getContentSummary(contentKey)
    console.log('got infohash for %s content %s',
      contentSummary ? 'existing' : 'new', contentKey)

    if (!contentSummary) {
      const contents = this.state.saved.contents

      // Check if an existing (non-active) content has the same info hash
      if (contents.find((t) => t.infoHash === infoHash)) {
        ipcRenderer.send('wt-stop-playing-content', infoHash)
        return dispatch('error', 'Cannot add duplicate content')
      }

      contentSummary = {
        contentKey: contentKey,
        status: 'new'
      }
      contents.unshift(contentSummary)
      sound.play('ADD')
    }

    contentSummary.infoHash = infoHash
    dispatch('update')
  }

  contentWarning (contentKey, message) {
    console.log('warning for content %s: %s', contentKey, message)
  }

  contentError (contentKey, message) {
    // TODO: WebContent needs semantic errors
    if (message.startsWith('Cannot add duplicate content')) {
      // Remove infohash from the message
      message = 'Cannot add duplicate content'
    }
    dispatch('error', message)

    const contentSummary = this.getContentSummary(contentKey)
    if (contentSummary) {
      console.log('Pausing content %s due to error: %s', contentSummary.infoHash, message)
      contentSummary.status = 'paused'
      dispatch('update')
    }
  }

  contentMetadata (contentKey, contentInfo) {
    // Summarize content
    const contentSummary = this.getContentSummary(contentKey)
    contentSummary.status = 'downloading'
    contentSummary.name = contentSummary.displayName || contentInfo.name
    contentSummary.path = contentInfo.path
    contentSummary.magnetURI = contentInfo.magnetURI
    // TODO: make contentInfo immutable, save separately as contentSummary.info
    // For now, check whether contentSummary.files has already been set:
    const hasDetailedFileInfo = contentSummary.files && contentSummary.files[0].path
    if (!hasDetailedFileInfo) {
      contentSummary.files = contentInfo.files
    }
    if (!contentSummary.selections) {
      contentSummary.selections = contentSummary.files.map((x) => true)
    }
    dispatch('update')

    // Save the .content file, if it hasn't been saved already
    if (!contentSummary.genericContentFileName) ipcRenderer.send('wt-save-content-file', contentKey)

    // Auto-generate a poster content, if it hasn't been generated already
    if (!contentSummary.posterFileName) ipcRenderer.send('wt-generate-content-poster', contentKey)
  }

  contentDone (contentKey, contentInfo) {
    // Update the content summary
    const contentSummary = this.getContentSummary(contentKey)
    contentSummary.status = 'seeding'

    // Notify the user that a content finished, but only if we actually DL'd at least part of it.
    // Don't notify if we merely finished verifying data files that were already on disk.
    if (contentInfo.bytesReceived > 0) {
      if (!this.state.window.isFocused) {
        this.state.dock.badge += 1
      }
      showDoneNotification(contentSummary)
      ipcRenderer.send('downloadFinished', getContentPath(contentSummary))
    }

    dispatch('update')
  }

  contentProgress (progressInfo) {
    // Overall progress across all active contents, 0 to 1, or -1 to hide the progress bar
    // Hide progress bar when client has no contents, or progress is 100%
    const progress = (!progressInfo.hasActiveContents || progressInfo.progress === 1)
      ? -1
      : progressInfo.progress

    // Show progress bar under the WebContent taskbar icon, on OSX
    this.state.dock.progress = progress

    // Update progress for each individual content
    progressInfo.contents.forEach((p) => {
      const contentSummary = this.getContentSummary(p.contentKey)
      if (!contentSummary) {
        console.log('warning: got progress for missing content %s', p.contentKey)
        return
      }
      contentSummary.progress = p
    })

    // TODO: Find an efficient way to re-enable this line, which allows subtitle
    //       files which are completed after a video starts to play to be added
    //       dynamically to the list of subtitles.
    // checkForSubtitles()
  }

  contentFileModtimes (contentKey, fileModtimes) {
    const contentSummary = this.getContentSummary(contentKey)
    if (!contentSummary) throw new Error('Not saving modtimes for deleted content ' + contentKey)
    contentSummary.fileModtimes = fileModtimes
    dispatch('stateSave')
  }

  contentFileSaved (contentKey, genericContentFileName) {
    console.log('content file saved %s: %s', contentKey, genericContentFileName)
    const contentSummary = this.getContentSummary(contentKey)
    contentSummary.genericContentFileName = genericContentFileName
    dispatch('stateSave')
  }

  contentPosterSaved (contentKey, posterFileName) {
    const contentSummary = this.getContentSummary(contentKey)
    contentSummary.posterFileName = posterFileName
    dispatch('stateSave')
  }

  contentAudioMetadata (infoHash, index, info) {
    const contentSummary = this.getContentSummary(infoHash)
    const fileSummary = contentSummary.files[index]
    fileSummary.audioInfo = info
    dispatch('update')
  }

  contentServerRunning (serverInfo) {
    this.state.server = serverInfo
  }

  // Gets a content summary {name, infoHash, status} from state.saved.contents
  // Returns undefined if we don't know that infoHash
  getContentSummary (contentKey) {
    return ContentSummary.getByKey(this.state, contentKey)
  }
}

function getContentPath (contentSummary) {
  let itemPath = ContentSummary.getFileOrFolder(contentSummary)
  if (contentSummary.files.length > 1) {
    itemPath = path.dirname(itemPath)
  }
  return itemPath
}

function showDoneNotification (content) {
  const notif = new window.Notification('Download Complete', {
    body: content.name,
    silent: true
  })

  notif.onclick = function () {
    ipcRenderer.send('show')
  }

  // Only play notification sound if player is inactive
  if (this.state.playing.isPaused) sound.play('DONE')
}
