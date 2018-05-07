const React = require("react");
const Bitfield = require("bitfield");
const prettyBytes = require("prettier-bytes");
const zeroFill = require("zero-fill");
const { dispatch, dispatcher } = require("../lib/dispatcher");
const path = require('path')
const config = require("../../config");

// Shows a screen share room's info
module.exports = class Player extends React.Component {
  render() {
    const state = this.props.state;
    return (
      <div className="content" onMouseMove={dispatcher("mediaMouseMoved")}
        className='player'>
        {renderContent(state)}
      </div>
    );
  }

  onComponentWillUnmount() {
    // Unload the media element so that Chromium stops trying to fetch data
    const tag = document.querySelector("audio,video");
    if (!tag) return;
    tag.pause();
    tag.src = "";
    tag.load();
  }
};

function renderContent(state) {
  // Show the media.
  const style = {}
  const gradient = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%)'
  const posterPath = path.join(config.STATIC_PATH, "share-room-info-background.jpg")
  style.backgroundContent = `${gradient}, url('${posterPath}')`
  return (
    <div
      key="letterbox"
      className="letterbox"
      onMouseMove={dispatcher("mediaMouseMoved")}
      style={style}
    >
    Hi Ya!
    Add new content info input/output here.
    </div>
  );
}