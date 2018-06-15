const electron = require("electron");
const path = require("path");

const Cast = require("../lib/cast");
const { dispatch } = require("../lib/dispatcher");
const telemetry = require("../lib/telemetry");
const {
  UnplayableFileError,
  UnplayableContentError
} = require("../lib/errors");
const sound = require("../lib/sound");

const ContentPlayer = require("../lib/content-player");
const ContentSummary = require("../lib/content-summary");

const Playlist = require("../lib/playlist");
const State = require("../lib/state");

const ipcRenderer = electron.ipcRenderer;

// Controls playback of contents and files within contents
module.exports = class PlaybackController {
  constructor(state, config, update) {
    this.state = state;
    this.config = config;
    this.update = update;
  }

  // Play a file in a content.
  // * Start playing content, if necessary
  // * Stream, if not already fully downloaded
  // * If no file index is provided, restore the most recently viewed file or autoplay the first
  playFile(infoHash, index /* optional */) {
    this.pauseActiveContents(infoHash);

    const state = this.state;
    if (state.location.url() === "player") {
      this.updatePlayer(infoHash, index, false, err => {
        if (err) dispatch("error", err);
        else this.play();
      });
    } else {
      let initialized = false;
      state.location.go(
        {
          url: "player",
          setup: cb => {
            const contentSummary = ContentSummary.getByKey(state, infoHash);

            if (index === undefined || initialized)
              index = contentSummary.mostRecentFileIndex;
            // if (index === undefined)
            //   index = contentSummary.files.findIndex(ContentPlayer.isPlayable);
            if (index === undefined) return cb(new UnplayableContentError());

            initialized = true;

            this.openPlayer(infoHash, index, err => {
              if (!err) this.play();
              cb(err);
            });
          },
          destroy: () => this.closePlayer()
        },
        err => {
          if (err) dispatch("error", err);
        }
      );
    }
  }

  // Open a file in OS default app.
  openItem(infoHash, index) {
    const contentSummary = ContentSummary.getByKey(this.state, infoHash);
    // const filePath = path.join(
    //   contentSummary.path,
    //   contentSummary.files[index].path
    // );
    const filePath = path.join(
      contentSummary.path
    );
    ipcRenderer.send("openItem", filePath);
  }

  // Toggle (play or pause) the currently playing media
  playPause() {
    const state = this.state;
    if (state.location.url() !== "player") return;

    // force rerendering if window is hidden,
    // in order to bypass `raf` and play/pause media immediately
    // const mediaTag = document.querySelector("video,audio");
    // if (!state.window.isVisible && mediaTag) {
    //   if (state.playing.isPaused) mediaTag.play();
    //   else mediaTag.pause();
    // }

    if (state.playing.isPaused) this.play();
    else this.pause();
  }

  pauseActiveContents(infoHash) {
    // Playback Priority: pause all active contents if needed.
    if (!this.state.saved.prefs.highestPlaybackPriority) return;

    // Do not pause active contents if playing a fully downloaded content.
    const contentSummary = ContentSummary.getByKey(this.state, infoHash);
    if (contentSummary.status === "seeding") return;

    dispatch("prioritizeContent", infoHash);
  }

  // Play next file in list (if any)
  nextTrack() {
    const state = this.state;
    if (Playlist.hasNext(state) && state.playing.location !== "external") {
      this.updatePlayer(
        state.playing.infoHash, Playlist.getNextIndex(state), false, (err) => {
          if (err) dispatch('error', err)
          else this.play()
        })
    }
  }

  // Play previous track in list (if any)
  previousTrack() {
    const state = this.state;
    if (Playlist.hasPrevious(state) && state.playing.location !== "external") {
      this.updatePlayer(
        state.playing.infoHash,
        Playlist.getPreviousIndex(state),
        false,
        err => {
          if (err) dispatch("error", err);
          else this.play();
        }
      );
    }
  }

  // Play (unpause) the current media
  play() {
    const state = this.state;
    if (!state.playing.isPaused) return;
    state.playing.isPaused = false;
    if (isCasting(state)) {
      Cast.play();
    }
    ipcRenderer.send("onPlayerPlay");
  }

  // Pause the currently playing media
  pause() {
    const state = this.state;
    if (state.playing.isPaused) return;
    state.playing.isPaused = true;
    if (isCasting(state)) {
      Cast.pause();
    }
    ipcRenderer.send("onPlayerPause");
  }

  // Skip specified number of seconds (backwards if negative)
  skip(time) {
    this.skipTo(this.state.playing.currentTime + time);
  }

  // Skip (aka seek) to a specific point, in seconds
  skipTo(time) {
    if (!Number.isFinite(time)) {
      console.error("Tried to skip to a non-finite time " + time);
      return console.trace();
    }
    if (isCasting(this.state)) Cast.seek(time);
    else this.state.playing.jumpToTime = time;
  }

  // Change playback speed. 1 = faster, -1 = slower
  // Playback speed ranges from 16 (fast forward) to 1 (normal playback)
  // to 0.25 (quarter-speed playback), then goes to -0.25, -0.5, -1, -2, etc
  // until -16 (fast rewind)
  changePlaybackRate(direction) {
    const state = this.state;
    let rate = state.playing.playbackRate;
    if (direction > 0 && rate < 2) {
      rate += 0.25;
    } else if (direction < 0 && rate > 0.25 && rate <= 2) {
      rate -= 0.25;
    } else if (direction > 0 && rate >= 1 && rate < 16) {
      rate *= 2;
    } else if (direction < 0 && rate > 1 && rate <= 16) {
      rate /= 2;
    }
    state.playing.playbackRate = rate;
    if (isCasting(state) && !Cast.setRate(rate)) {
      state.playing.playbackRate = 1;
    }
    // Wait a bit before we hide the controls and header again
    state.playing.mouseStationarySince = new Date().getTime();
  }

  // Change the volume, in range [0, 1], by some amount
  // For example, volume muted (0), changeVolume (0.3) increases to 30% volume
  changeVolume(delta) {
    // change volume with delta value
    this.setVolume(this.state.playing.volume + delta);
  }

  // Set the volume to some value in [0, 1]
  setVolume(volume) {
    // check if its in [0.0 - 1.0] range
    volume = Math.max(0, Math.min(1, volume));

    const state = this.state;
    if (isCasting(state)) {
      Cast.setVolume(volume);
    } else {
      state.playing.setVolume = volume;
    }
  }

  // Hide player controls while playing video, if the mouse stays still for a while
  // Never hide the controls when:
  // * The mouse is over the controls or we're scrubbing (see CSS)
  // * The video is paused
  // * The video is playing remotely on Chromecast or Airplay
  showOrHidePlayerControls() {
    const state = this.state;
    const hideControls = state.shouldHidePlayerControls();

    if (hideControls !== state.playing.hideControls) {
      state.playing.hideControls = hideControls;
      return true;
    }
    return false;
  }

  // Opens the video player to a specific content
  openPlayer(infoHash, index, cb) {
    const state = this.state;
    const contentSummary = ContentSummary.getByKey(state, infoHash);

    state.playing.infoHash = contentSummary.infoHash;
    state.playing.isReady = false;

    // update UI to show pending playback
    sound.play("PLAY");

    this.startServer(contentSummary);
    ipcRenderer.send("onPlayerOpen");
    this.updatePlayer(infoHash, index, true, cb);
  }

  // Starts WebContent server for media streaming
  startServer(contentSummary) {
    const state = this.state;

    if (contentSummary.status === "paused") {
      dispatch("startPlayingContentSummary", contentSummary.contentKey);
      ipcRenderer.once("wt-ready-" + contentSummary.infoHash, () =>
        onContentReady()
      );
    } else {
      onContentReady();
    }

    function onContentReady() {
      ipcRenderer.send("wt-start-server", contentSummary.infoHash);
      ipcRenderer.once("wt-server-running", () => {
        state.playing.isReady = true;
      });
    }
  }

  // Called each time the current file changes
  updatePlayer(infoHash, index, resume, cb) {
    const state = this.state;

    const contentSummary = ContentSummary.getByKey(state, infoHash);
    state.window.title = contentSummary.name;

    // play in VLC if set as default player (Preferences / Playback / Play in VLC)
    if (this.state.saved.prefs.openExternalPlayer) {
      dispatch("openExternalPlayer");
      this.update();
      cb();
      return;
    }

    // otherwise, play the video
    this.update();

    ipcRenderer.send(
      "onPlayerUpdate",
      Playlist.hasNext(state),
      Playlist.hasPrevious(state)
    );
    cb();
  }

  closePlayer() {
    console.log("closePlayer");

    // Quit any external players, like Chromecast/Airplay/etc or VLC
    const state = this.state;
    if (isCasting(state)) {
      Cast.stop();
    }
    if (state.playing.location === "external") {
      ipcRenderer.send("quitExternalPlayer");
    }

    // Save volume (this session only, not in state.saved)
    state.previousVolume = state.playing.volume;

    if (!state.playing.isReady) telemetry.logPlayAttempt("abandoned"); // user gave up waiting

    // Reset the window contents back to the home screen
    state.playing = State.getDefaultPlayState();
    state.server = null;

    // Reset the window size and location back to where it was
    if (state.window.isFullScreen) {
      dispatch("toggleFullScreen", false);
    }
    restoreBounds(state);

    // Tell the WebContent process to kill the content-to-HTTP server
    ipcRenderer.send("wt-stop-server");

    ipcRenderer.send("onPlayerClose");

    // Playback Priority: resume previously paused downloads.
    if (this.state.saved.prefs.highestPlaybackPriority) {
      dispatch("resumePausedContents");
    }

    this.update();
  }
};

// Checks whether we are connected and already casting
// Returns false if we not casting (state.playing.location === 'local')
// or if we're trying to connect but haven't yet ('chromecast-pending', etc)
function isCasting(state) {
  return (
    state.playing.location === "chromecast" ||
    state.playing.location === "airplay" ||
    state.playing.location === "dlna"
  );
}

function restoreBounds(state) {
  ipcRenderer.send("setAspectRatio", 0);
  if (state.window.bounds) {
    ipcRenderer.send("setBounds", state.window.bounds, false);
  }
}
