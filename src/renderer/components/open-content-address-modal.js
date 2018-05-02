const React = require('react')
const TextField = require('material-ui/TextField').default

const ModalOKCancel = require('./modal-ok-cancel')
const {dispatch, dispatcher} = require('../lib/dispatcher')

module.exports = class OpenContentAddressModal extends React.Component {
  render () {
    return (
      <div className='open-content-address-modal'>
        <p><label>Enter content address or magnet link</label></p>
        <div>
          <TextField
            id='content-address-field'
            className='control'
            ref={(c) => { this.contentURL = c }}
            fullWidth
            onKeyDown={handleKeyDown.bind(this)} />
        </div>
        <ModalOKCancel
          cancelText='CANCEL'
          onCancel={dispatcher('exitModal')}
          okText='OK'
          onOK={handleOK.bind(this)} />
      </div>
    )
  }

  componentDidMount () {
    this.contentURL.input.focus()
  }
}

function handleKeyDown (e) {
  if (e.which === 13) handleOK.call(this) /* hit Enter to submit */
}

function handleOK () {
  dispatch('exitModal')
  dispatch('addContent', this.contentURL.input.value)
}
