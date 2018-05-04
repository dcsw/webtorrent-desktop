const path = require('path')
const React = require('react')
const PropTypes = require('prop-types')

const colors = require('material-ui/styles/colors')
const Checkbox = require('material-ui/Checkbox').default
const RaisedButton = require('material-ui/RaisedButton').default
const Heading = require('../components/heading')
const PathSelector = require('../components/path-selector')

const {dispatch} = require('../lib/dispatcher')
const config = require('../../config')

class PreferencesPage extends React.Component {
  constructor (props) {
    super(props)

    this.handleDownloadPathChange =
      this.handleDownloadPathChange.bind(this)

    this.handleOpenExternalPlayerChange =
      this.handleOpenExternalPlayerChange.bind(this)

    this.handleExternalPlayerPathChange =
      this.handleExternalPlayerPathChange.bind(this)

    this.handleStartupChange =
      this.handleStartupChange.bind(this)
  }

  downloadPathSelector () {
    return (
      <Preference>
        <PathSelector
          dialog={{
            title: 'Select download directory',
            properties: [ 'openDirectory' ]
          }}
          onChange={this.handleDownloadPathChange}
          title='Download location'
          value={this.props.state.unsaved.prefs.downloadPath} />
      </Preference>
    )
  }

  handleDownloadPathChange (filePath) {
    dispatch('updatePreferences', 'downloadPath', filePath)
  }

  openExternalPlayerCheckbox () {
    return (
      <Preference>
        <Checkbox
          className='control'
          checked={!this.props.state.unsaved.prefs.openExternalPlayer}
          label={'Play content media files using WebContent'}
          onCheck={this.handleOpenExternalPlayerChange} />
      </Preference>
    )
  }

  handleOpenExternalPlayerChange (e, isChecked) {
    dispatch('updatePreferences', 'openExternalPlayer', !isChecked)
  }

  highestPlaybackPriorityCheckbox () {
    return (
      <Preference>
        <Checkbox
          className='control'
          checked={this.props.state.unsaved.prefs.highestPlaybackPriority}
          label={'Highest Playback Priority'}
          onCheck={this.handleHighestPlaybackPriorityChange}
        />
        <p>Pauses all active contents to allow playback to use all of the available bandwidth.</p>
      </Preference>
    )
  }

  handleHighestPlaybackPriorityChange (e, isChecked) {
    dispatch('updatePreferences', 'highestPlaybackPriority', isChecked)
  }

  externalPlayerPathSelector () {
    const playerPath = this.props.state.unsaved.prefs.externalPlayerPath
    const playerName = this.props.state.getExternalPlayerName()

    const description = this.props.state.unsaved.prefs.openExternalPlayer
      ? `Content media files will always play in ${playerName}.`
      : `Content media files will play in ${playerName} if WebContent cannot play them.`

    return (
      <Preference>
        <p>{description}</p>
        <PathSelector
          dialog={{
            title: 'Select media player app',
            properties: [ 'openFile' ]
          }}
          displayValue={playerName}
          onChange={this.handleExternalPlayerPathChange}
          title='External player'
          value={playerPath ? path.dirname(playerPath) : null} />
      </Preference>
    )
  }

  handleExternalPlayerPathChange (filePath) {
    dispatch('updatePreferences', 'externalPlayerPath', filePath)
  }

  autoAddContentsCheckbox () {
    return (
      <Preference>
        <Checkbox
          className='control'
          checked={this.props.state.unsaved.prefs.autoAddContents}
          label={'Watch for new .content files and add them immediately'}
          onCheck={(e, value) => { this.handleAutoAddContentsChange(e, value) }}
        />
      </Preference>
    )
  }

  handleAutoAddContentsChange (e, isChecked) {
    const contentsFolderPath = this.props.state.unsaved.prefs.contentsFolderPath
    if (isChecked && !contentsFolderPath) {
      alert('Select a contents folder first.') // eslint-disable-line
      e.preventDefault()
      return
    }

    dispatch('updatePreferences', 'autoAddContents', isChecked)

    if (isChecked) {
      dispatch('startFolderWatcher', null)
      return
    }

    dispatch('stopFolderWatcher', null)
  }

  contentsFolderPathSelector () {
    const contentsFolderPath = this.props.state.unsaved.prefs.contentsFolderPath

    return (
      <Preference>
        <PathSelector
          dialog={{
            title: 'Select folder to watch for new contents',
            properties: [ 'openDirectory' ]
          }}
          displayValue={contentsFolderPath || ''}
          onChange={this.handlecontentsFolderPathChange}
          title='Folder to watch'
          value={contentsFolderPath ? path.dirname(contentsFolderPath) : null} />
      </Preference>
    )
  }

  handlecontentsFolderPathChange (filePath) {
    dispatch('updatePreferences', 'contentsFolderPath', filePath)
  }

  setDefaultAppButton () {
    const isFileHandler = this.props.state.unsaved.prefs.isFileHandler
    if (isFileHandler) {
      return (
        <Preference>
          <p>WebContent is your default content app. Hooray!</p>
        </Preference>
      )
    }
    return (
      <Preference>
        <p>WebContent is not currently the default content app.</p>
        <RaisedButton
          className='control'
          onClick={this.handleSetDefaultApp}
          label='Make WebContent the default' />
      </Preference>
    )
  }

  handleStartupChange (e, isChecked) {
    dispatch('updatePreferences', 'startup', isChecked)
  }

  setStartupSection () {
    if (config.IS_PORTABLE) {
      return
    }

    return (
      <PreferencesSection title='Startup'>
        <Preference>
          <Checkbox
            className='control'
            checked={this.props.state.unsaved.prefs.startup}
            label={'Open WebContent on startup.'}
            onCheck={this.handleStartupChange}
          />
        </Preference>
      </PreferencesSection>
    )
  }

  handleSetDefaultApp () {
    dispatch('updatePreferences', 'isFileHandler', true)
  }

  render () {
    const style = {
      color: colors.grey400,
      marginLeft: 25,
      marginRight: 25
    }
    return (
      <div style={style}>
        <PreferencesSection title='Folders'>
          {this.downloadPathSelector()}
          {this.autoAddContentsCheckbox()}
          {this.contentsFolderPathSelector()}
        </PreferencesSection>
        <PreferencesSection title='Playback'>
          {this.openExternalPlayerCheckbox()}
          {this.externalPlayerPathSelector()}
          {this.highestPlaybackPriorityCheckbox()}
        </PreferencesSection>
        <PreferencesSection title='Default content app'>
          {this.setDefaultAppButton()}
        </PreferencesSection>
        {this.setStartupSection()}
      </div>
    )
  }
}

class PreferencesSection extends React.Component {
  static get propTypes () {
    return {
      title: PropTypes.string
    }
  }

  render () {
    const style = {
      marginBottom: 25,
      marginTop: 25
    }
    return (
      <div style={style}>
        <Heading level={2}>{this.props.title}</Heading>
        {this.props.children}
      </div>
    )
  }
}

class Preference extends React.Component {
  render () {
    const style = { marginBottom: 10 }
    return (<div style={style}>{this.props.children}</div>)
  }
}

module.exports = PreferencesPage
