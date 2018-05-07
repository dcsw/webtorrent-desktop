const React = require("react");
const Bitfield = require("bitfield");
const prettyBytes = require("prettier-bytes");
const zeroFill = require("zero-fill");
const { dispatch, dispatcher } = require("../lib/dispatcher");
const path = require("path");

const FlatButton = require("material-ui/FlatButton").default;
const RaisedButton = require("material-ui/RaisedButton").default;
const TextField = require("material-ui/TextField").default;
const Checkbox = require("material-ui/Checkbox").default;

const CreateContentErrorPage = require("../components/create-content-error-page");
const Heading = require("../components/heading");
const ShowMore = require("../components/show-more");
const config = require("../../config");

// Shows a screen share room's info
module.exports = class Player extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.props.state,
      url: '',
      name: '',
      description: ''
    };

    // Create React event handlers only once
    this.setUrl = (_, url) => this.setState({url})  // '_' is a convention for non-used parameter (click event in this case)
    this.setName = (_, name) => this.setState({name})
    this.setDescription = (_, description) => this.setState({description})
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render() {
    const state = this.props.state;
    return (
      <div className="content" onMouseMove={dispatcher("mediaMouseMoved")} className="player">
        {this.renderContent(state)}
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

  renderContent(state) {
    // Show the media.
    const style = {};
    const gradient = "linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%)";
    const posterPath = path.join(config.STATIC_PATH, "share-room-info-background.jpg");
    style.backgroundContent = `${gradient}, url('${posterPath}')`;
    // Align the text fields
    const textFieldStyle = {} // { width: "" };
    const textareaStyle = {} // { margin: 0 };
    return (
      <div className="create-content">
        <Heading level={1}>Create content</Heading>
        <span key="name" className="content-attribute">
          <label>Name:</label>
          <TextField
            className="content-comment control"
            style={textFieldStyle}
            textareaStyle={textareaStyle}
            hintText="Your content's name..."
            value={this.state.name}
            onChange={this.setName}
          />
        </span>
        <div key="description" className="content-attribute">
          <label>Description:</label>
          <TextField
            className="content-comment control"
            style={textFieldStyle}
            textareaStyle={textareaStyle}
            hintText="Description of your content..."
            multiLine
            rows={2}
            rowsMax={10}
            value={this.state.description}
            onChange={this.setDescription}
          />
        </div>
        <span key="url" className="content-attribute">
          <label>URL:</label>
          <TextField
            className="content-comment control"
            style={textFieldStyle}
            textareaStyle={textareaStyle}
            hintText="URL to your content..."
            value={this.state.url}
            onChange={this.setUrl}
          />
        </span>
        {
          // <ShowMore
          //   style={{
          //     marginBottom: 10
          //   }}
          //   hideLabel="Hide advanced settings..."
          //   showLabel="Show advanced settings...">
          //   {this.renderAdvanced()}
          // </ShowMore>
        }
        <div className="float-right">
          <FlatButton
            className="control cancel"
            label="Cancel"
            style={{
              marginRight: 10
            }}
            onClick={dispatcher("cancel")}
          />
          <RaisedButton className="control create-content-button" label="Create Content" primary onClick={this.handleSubmit} />
        </div>
      </div>
    );
  }

  // Renders everything after clicking Show Advanced...:
  renderAdvanced() {
    // Align the text fields
    const textFieldStyle = { width: "" };
    const textareaStyle = { margin: 0 };

    return (
      <div key="advanced" className="create-content-advanced">
        Put advanced config here...
      </div>
    );
  }

  handleSubmit() {
    const options = {
      url: this.state.url,
      name: this.state.name,
      description: this.state.description
    };
    dispatch("createContent", options);
  }
};
