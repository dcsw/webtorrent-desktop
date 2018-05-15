const React = require('react')
const prettyBytes = require('prettier-bytes')

const Checkbox = require('material-ui/Checkbox').default
const LinearProgress = require('material-ui/LinearProgress').default

const ContentSummary = require('../lib/content-summary')
const ContentPlayer = require('../lib/content-player')
const {dispatcher} = require('../lib/dispatcher')

module.exports = class ContentList extends React.Component {
  render () {
    const state = this.props.state

    const contents = []
    if (state.downloadPathStatus === 'missing') {
      contents.push(
        <div key='content-missing-path'>
          <p>Download path missing: {state.saved.prefs.downloadPath}</p>
          <p>Check that all drives are connected?</p>
          <p>Alternatively, choose a new download path
            in <a href='#' onClick={dispatcher('preferences')}>Preferences</a>
          </p>
        </div>
      )
    }
    const contentElems = state.saved.contents.map(
      (contentSummary) => this.renderContent(contentSummary)
    )
    contents.push(...contentElems)
    contents.push(
      <div key='content-placeholder' className='content-placeholder'>
        <span className='ellipsis'>Drop a content file here or paste a magnet link</span>
      </div>
    )

    return (
      <div key='content-list' className='content-list'>
        {contents}
      </div>
    )
  }

  renderContent (contentSummary) {
    const state = this.props.state
    const infoHash = contentSummary.infoHash
    const isSelected = infoHash && state.selectedInfoHash === infoHash

    // Background content: show some nice visuals, like a frame from the movie, if possible
    const style = {}
    if (contentSummary.posterFileName) {
      const gradient = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%)'
      const posterPath = ContentSummary.getPosterPath(contentSummary)
      style.backgroundContent = `${gradient}, url('${posterPath}')`
    }

    // Foreground: name of the content, basic info like size, play button,
    // cast buttons if available, and delete
    const classes = ['content']
    if (isSelected) classes.push('selected')
    if (!infoHash) classes.push('disabled')
    // FIXME: get this out of here...
    // if (!contentSummary.contentKey) {
    //   contentSummary.contentKey = 'yabbadabbadoo' + Math.random() * 1000000;
    // }
    // if (!contentSummary.contentKey) throw new Error('Missing contentKey')
    return (
      <div
        id={contentSummary.testID && ('content-' + contentSummary.testID)}
        // key={contentSummary.contentKey}
        style={style}
        className={classes.join(' ')}
        onContextMenu={infoHash && dispatcher('openContentContextMenu', infoHash)}
        onClick={infoHash && dispatcher('toggleSelectContent', infoHash)}>
        {this.renderContentMetadata(contentSummary)}
        {infoHash ? this.renderContentButtons(contentSummary) : null}
        {isSelected ? this.renderContentDetails(contentSummary) : null}
        <hr />
      </div>
    )
  }

  // Show name, download status, % complete
  renderContentMetadata (contentSummary) {
    const name = contentSummary.name || 'Loading name...'
    const elements = [(
      <div key='name' className='name ellipsis'>{name}</div>
    )]

    // If it's downloading/seeding then show progress info
    const prog = contentSummary.progress
    let progElems
    if (contentSummary.error) {
      progElems = [getErrorMessage(contentSummary)]
    } else if (contentSummary.status !== 'paused' && prog) {
      progElems = [
        renderDownloadCheckbox(),
        renderContentStatus(),
        renderProgressBar(),
        renderPercentProgress(),
        renderTotalProgress(),
        renderPeers(),
        renderSpeeds(),
        renderEta()
      ]
    } else {
      progElems = [
        renderDownloadCheckbox(),
        renderContentStatus()
      ]
    }
    elements.push(
      <div key='progress-info' className='ellipsis'>
        {progElems}
      </div>
    )

    const url = contentSummary.url || 'Loading url...'
    elements.push(
      <div key='url' className='ellipsis'>{url}</div>
    )

    return (<div key='metadata' className='metadata'>{elements}</div>)

    function renderDownloadCheckbox () {
      const infoHash = contentSummary.infoHash
      const isActive = ['downloading', 'seeding'].includes(contentSummary.status)
      return (
        <Checkbox
          key='download-button'
          className={'control download ' + contentSummary.status}
          style={{
            display: 'inline-block',
            width: 32
          }}
          iconStyle={{
            width: 20,
            height: 20
          }}
          checked={isActive}
          onClick={stopPropagation}
          onCheck={dispatcher('toggleContent', infoHash)} />
      )
    }

    function renderProgressBar () {
      const progress = Math.floor(100 * prog.progress)
      const styles = {
        wrapper: {
          display: 'inline-block',
          marginRight: 8
        },
        progress: {
          height: 8,
          width: 30
        }
      }
      return (
        <div style={styles.wrapper}>
          <LinearProgress style={styles.progress} mode='determinate' value={progress} />
        </div>
      )
    }

    function renderPercentProgress () {
      const progress = Math.floor(100 * prog.progress)
      return (<span key='percent-progress'>{progress}%</span>)
    }

    function renderTotalProgress () {
      const downloaded = prettyBytes(prog.downloaded)
      const total = prettyBytes(prog.length || 0)
      if (downloaded === total) {
        return (<span key='total-progress'>{downloaded}</span>)
      } else {
        return (<span key='total-progress'>{downloaded} / {total}</span>)
      }
    }

    function renderPeers () {
      if (prog.numPeers === 0) return
      const count = prog.numPeers === 1 ? 'peer' : 'peers'
      return (<span key='peers'>{prog.numPeers} {count}</span>)
    }

    function renderSpeeds () {
      let str = ''
      if (prog.downloadSpeed > 0) str += ' ↓ ' + prettyBytes(prog.downloadSpeed) + '/s'
      if (prog.uploadSpeed > 0) str += ' ↑ ' + prettyBytes(prog.uploadSpeed) + '/s'
      if (str === '') return
      return (<span key='download'>{str}</span>)
    }

    function renderEta () {
      const downloaded = prog.downloaded
      const total = prog.length || 0
      const missing = total - downloaded
      const downloadSpeed = prog.downloadSpeed
      if (downloadSpeed === 0 || missing === 0) return

      const rawEta = missing / downloadSpeed
      const hours = Math.floor(rawEta / 3600) % 24
      const minutes = Math.floor(rawEta / 60) % 60
      const seconds = Math.floor(rawEta % 60)

      // Only display hours and minutes if they are greater than 0 but always
      // display minutes if hours is being displayed
      const hoursStr = hours ? hours + 'h' : ''
      const minutesStr = (hours || minutes) ? minutes + 'm' : ''
      const secondsStr = seconds + 's'

      return (<span>{hoursStr} {minutesStr} {secondsStr} remaining</span>)
    }

    function renderContentStatus () {
      let status
      if (contentSummary.status === 'paused') {
        if (!contentSummary.progress) status = ''
        else if (contentSummary.progress.progress === 1) status = 'Not seeding'
        else status = 'Paused'
      } else if (contentSummary.status === 'downloading') {
        status = 'Downloading'
      } else if (contentSummary.status === 'seeding') {
        status = 'Seeding'
      } else { // contentSummary.status is 'new' or something unexpected
        status = ''
      }
      return (<span>{status}</span>)
    }
  }

  // Download button toggles between contenting (DL/seed) and paused
  // Play button starts streaming the content immediately, unpausing if needed
  renderContentButtons (contentSummary) {
    const infoHash = contentSummary.infoHash

    // Only show the play/dowload buttons for contents that contain playable media
    let playButton
    if (!contentSummary.error && ContentPlayer.isPlayableContentSummary(contentSummary)) {
      playButton = (
        <i
          key='play-button'
          title='Start streaming'
          className={'icon play'}
          onClick={dispatcher('playFile', infoHash)}>
          play_circle_outline
        </i>
      )
    }

    return (
      <div className='content-controls'>
        {playButton}
        <i
          key='delete-button'
          className='icon delete'
          title='Remove content'
          onClick={dispatcher('confirmDeleteContent', infoHash, false)}>
          close
        </i>
      </div>
    )
  }

  // Show files, per-file download status and play buttons, and so on
  renderContentDetails (contentSummary) {
    let filesElement
    if (contentSummary.error || !contentSummary.files) {
      let message = ''
      if (contentSummary.error === 'path-missing') {
        // Special case error: this content's download dir or file is missing
        message = 'Missing path: ' + ContentSummary.getFileOrFolder(contentSummary)
      } else if (contentSummary.error) {
        // General error for this content: just show the message
        message = contentSummary.error.message || contentSummary.error
      } else if (contentSummary.status === 'paused') {
        // No file info, no infohash, and we're not trying to download from the DHT
        message = 'Failed to load content info. Click the download button to try again...'
      } else {
        // No file info, no infohash, trying to load from the DHT
        message = 'Downloading content info...'
      }
      filesElement = (
        <div key='files' className='files warning'>
          {message}
        </div>
      )
    } else {
      // We do know the files. List them and show download stats for each one
      const fileRows = contentSummary.files
        .filter((file) => !file.path.includes('/.____padding_file/'))
        .map((file, index) => ({ file, index }))
        .map((object) => this.renderFileRow(contentSummary, object.file, object.index))

      filesElement = (
        <div key='files' className='files'>
          <table>
            <tbody>
              {fileRows}
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div key='details' className='content-details'>
        {filesElement}
        <div key='description' className='content-details'>
          {contentSummary.description}
        </div>
      </div>
    )
  }

  // Show a single contentSummary file in the details view for a single content
  renderFileRow (contentSummary, file, index) {
    // First, find out how much of the file we've downloaded
    // Are we even contenting it?
    const isSelected = contentSummary.selections && contentSummary.selections[index]
    let isDone = false // Are we finished contenting it?
    let progress = ''
    if (contentSummary.progress && contentSummary.progress.files &&
        contentSummary.progress.files[index]) {
      const fileProg = contentSummary.progress.files[index]
      isDone = fileProg.numPiecesPresent === fileProg.numPieces
      progress = Math.round(100 * fileProg.numPiecesPresent / fileProg.numPieces) + '%'
    }

    // Second, for media files where we saved our position, show how far we got
    let positionElem
    if (file.currentTime) {
      // Radial progress bar. 0% = start from 0:00, 270% = 3/4 of the way thru
      positionElem = this.renderRadialProgressBar(file.currentTime / file.duration)
    }

    // Finally, render the file as a table row
    const isPlayable = ContentPlayer.isPlayable(file)
    const infoHash = contentSummary.infoHash
    let icon
    let handleClick
    if (isPlayable) {
      icon = 'play_arrow' /* playable? add option to play */
      handleClick = dispatcher('playFile', infoHash, index)
    } else {
      icon = 'description' /* file icon, opens in OS default app */
      handleClick = isDone
        ? dispatcher('openItem', infoHash, index)
        : (e) => e.stopPropagation() // noop if file is not ready
    }
    // TODO: add a css 'disabled' class to indicate that a file cannot be opened/streamed
    let rowClass = ''
    if (!isSelected) rowClass = 'disabled' // File deselected, not being contented
    if (!isDone && !isPlayable) rowClass = 'disabled' // Can't open yet, can't stream
    return (
      <tr key={index} onClick={handleClick}>
        <td className={'col-icon ' + rowClass}>
          {positionElem}
          <i className='icon'>{icon}</i>
        </td>
        <td className={'col-name ' + rowClass}>
          {file.name}
        </td>
        <td className={'col-progress ' + rowClass}>
          {isSelected ? progress : ''}
        </td>
        <td className={'col-size ' + rowClass}>
          {prettyBytes(file.length)}
        </td>
        <td className='col-select'
          onClick={dispatcher('toggleContentFile', infoHash, index)}>
          <i className='icon deselect-file'>{isSelected ? 'close' : 'add'}</i>
        </td>
      </tr>
    )
  }

  renderRadialProgressBar (fraction, cssClass) {
    const rotation = 360 * fraction
    const transformFill = {transform: 'rotate(' + (rotation / 2) + 'deg)'}
    const transformFix = {transform: 'rotate(' + rotation + 'deg)'}

    return (
      <div key='radial-progress' className={'radial-progress ' + cssClass}>
        <div key='circle' className='circle'>
          <div key='mask-full' className='mask full' style={transformFill}>
            <div key='fill' className='fill' style={transformFill} />
          </div>
          <div key='mask-half' className='mask half'>
            <div key='fill' className='fill' style={transformFill} />
            <div key='fill-fix' className='fill fix' style={transformFix} />
          </div>
        </div>
        <div key='inset' className='inset' />
      </div>
    )
  }
}

function stopPropagation (e) {
  e.stopPropagation()
}

function getErrorMessage (contentSummary) {
  const err = contentSummary.error
  if (err === 'path-missing') {
    return (
      <span>
        Path missing.<br />
        Fix and restart the app, or delete the content.
      </span>
    )
  }
  return 'Error'
}
