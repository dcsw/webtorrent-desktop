# WebContent Desktop Version History

## v0.20.0 - 2018-04-26

### Added

- Added support for additional audio extensions: 'aiff', 'ape', 'mp2', 'oga', 'opus', 'wma' (#1240)

### Changed

- Displaying filename while music metadata is being downloaded (#1361)
- Improved the poster selection for audio/music based torrents (#1334)
- Launch VLC player without the `--video-on-top` flag (#1286)

### Fixed

- Fix silently failing to open magnets links on Linux (#1367)

## v0.19.0 - 2018-01-26

### Added
- Added watch folder feature: Automatically add new torrent files added to a folder on disk (#1154)
- Added highest playback priority feature: pauses other active torrents when playback starts (#840)
- Add 'Start Speaking' and 'Stop Speaking' menu item (Mac) (#439)
- Add pinch-to-zoom gesture to enter/exit fullscreen (#1148)

### Changed
- [SECURITY] Mitigate Electron protocol handler issue (Windows)
- Moved project from Feross's GitHub account to the WebTorrent GitHub organization
- Updated to electron@1.6.16
- Updated to material-ui@0.17
- Treat .FLAC as playable audio (#1127)

### Fixed
- Fix time and duration so it doesn't bounce in the UI (#1233)
- Fix 'About WebTorrent' menu location on Windows (#1120)

## v0.18.0 - 2017-02-03

### Added
- Add a new "Transfers" menu for pausing or resuming all contents (#1027)

### Changed
- Update Electron to 1.4.15
  - Windows 32-bit: App can use 4GB of memory instead of just 2GB
  - Fix "Portable App" writing crash reports to "%APPDATA%\Temp" (Windows)
- Updated WebContent engine to 0.98.5
  - Fix issue where http web seeds would sometimes stall
  - Don't send 'completed' event to tracker again if content is already complete
  - Add more peer ID entropy
  - Set user-agent header for tracker http requests

### Fixed
- Fix paste shortcut in tracker list on Create Content page (#1112)
- Auto-focus the 'OK' button in modal dialogs (#1058)
- Fix formatting issue in the speed stats on the Player page (#1039)

## v0.17.2 - 2016-10-10

### Fixed
- Windows: Fix impossible-to-delete "Wired CD" default content
- Throttle browser-window 'move' and 'resize' events
- Fix crash ("Cannot read property 'files' of null" error)
- Fix crash ("TypeError: Cannot read property 'startPiece' of undefined")

## v0.17.1 - 2016-10-03

### Changed
- Faster startup (improved by ~25%)
- Update Electron to 1.4.2
- Remove support for pasting multiple newline-separated magnet links
- Reduce UX sound volume

### Fixed
- Fix external player (VLC, etc.) opening before HTTP server was ready
- Windows (Portable App): Fix "Portable App" mode
  - Write application support files to the "Portable Settings" folder
  - Stop writing Electron "single instance" lock file to "%APPDATA%\Roaming\WebContent"
  - Some temp data is still written to "%APPDATA%\Temp" (will be fixed in future version)
- Don't show pointer cursor on content list checkbox
- Trim extra whitespace from magnet links pasted into "Open Content Address" dialog
- Fix weird outline on 'Create Content' button

## v0.17.0 - 2016-09-23

### Added
- Remember window size and position

### Changed
- Content list redesign
- Quieter, more subtle sounds
- Got rid of the play button spinner, now goes to the player immediately
- Faster startup

### Fixed
- Fix bug where playback rate could go negative
- Don't hide header when moused over player controls
- Fix Delete Data File on Windows
- Fix a sad, sad bug that resulted in 100+ MB config files
- Fix app DMG background image

## v0.16.0 - 2016-09-18

### Added
<<<<<<< HEAD
- **Windows 64-bit support!** ([#931](https://github.com/webcontent/webcontent-desktop/pull/931))
=======
- **Windows 64-bit support!** (#931)
>>>>>>> a1cfe8730bcf09c3b2fc08a6d63b620e8d6536e3
  - Existing 32-bit users will update to 64-bit automatically in next release
  - 64-bit reduces likelihood of out-of-memory errors by increasing the address space

### Fixed
- Mac: Fix background image on .DMG

## v0.15.0 - 2016-09-16

### Added
- Option to start automatically on login
- Add integration tests
- Add more detailed telemetry to diagnose "buffer allocation failed"

### Changed
- Disable playback controls while in external player (#909)

### Fixed
- Fix several uncaught errors (#889, #891, #892)
- Update to the latest webcontent.js, fixing some more uncaught errors
- Clicking on the "content finished" notification works again (#912)

## v0.14.0 - 2016-09-03

### Added
- Autoplay through all files in a content (#871)
- Contents now have a progress bar (#844)

### Changed
- Modals now use Material UI
- Content list style improvements

### Fixed
- Fix App.js crash in Linux (#882)
- Fix error on Windows caused by `setBadge` (#867)
- Don't crash when restarting after adding a magnet link (#869)
- Restore playback state when reopening player (#877)

## v0.13.1 - 2016-08-31

### Fixed
- Fixed the Create Content page

## v0.13.0 - 2016-08-31

### Added
- Support .m4a audio
- Better telemetry: log error versions, report more types of errors

### Changed
- New look - Material UI. Rewrote Create Content and Preferences pages.

### Fixed
- Fixed telemetry [object Object] and [object HTMLMediaElement] bugs
- Don't render player controls when playing externally, eg in VLC
- Don't play notification sounds during media playback

## v0.12.0 - 2016-08-23

### Added
- Custom external media player
- Linux: add system-wide launcher and icons for Debian, including Ubuntu

### Changed
- Telemetry improvements: redact stacktraces, log app version

### Fixed
- Fix playback and download of default contents ("missing path" error) (#804)
- Fix Delete Content + Data for newly added magnet links
- Fix jumpToTime error (#804)

## v0.11.0 - 2016-08-19

### Added
- New Preference to "Set WebContent as default handler for contents and magnet links" (#771)
- New Preference to "Always play in VLC" (#674)
- Check for missing default download path and content folders on start up (#776)

### Changed
- Do not automatically set WebContent as the default handler for contents (#771)
- Contents can only be created from the home screen (#770)
- Update Electron to 1.3.3 (#772)

### Fixed
- Allow modifying the default tracker list on the Create Content page (#775)
- Prevent opening multiple stacked Preference windows or Create Content windows (#770)
- Windows: Player window auto-resize does not match video aspect ratio (#565)
- Missing page title on Create Content page

## v0.10.0 - 2016-08-05

### Added
- Drag-and-drop magnet links (selected text) is now supported (#284)
- Windows: Add "User Tasks" shortcuts to app icon in Start Menu (#114)
- Linux: Show badge count for completed content downloads

### Changed
- Change WebContent Desktop peer ID prefix to 'WD' to distinguish from WebContent in the browser, 'WW' (#688)
- Switch UI to React to improve UI rendering speed (#729)
  - The primary bottleneck was actually `hyperx`, not `virtual-dom`.
- Update Electron to 1.3.2 (#738) (#739) (#740) (#747) (#756)
  - Mac 10.9: Fix the fullscreen button showing
  - Mac 10.9: Fix window having border
  - Mac 10.9: Fix occasional crash
  - Mac: Update Squirrel.Mac to 0.2.1 (fixes situations in which updates would not get applied)
  - Mac: Fix window not showing in Window menu
  - Mac: Fix context menu always choosing first item by default
  - Linux: Fix startup crashes (some Linux distros)
  - Linux: Fix menubar not hiding after entering fullscreen (some Linux distros)
- Improved location history (back/forward buttons) to fix rare exceptions (#687) (#748)
  - Location history abstraction released independently as [`location-history`](https://www.npmjs.com/package/location-history)

### Fixed
- When streaming to VLC, set VLC window title to content file name (#746)
- Fix "Cannot read property 'numPiecesPresent' of undefined" exception (#695)
- Fix rare case where config file could not be completely written (#733)

## v0.9.0 - 2016-07-20

### Added
- Save selected subtitles
- Ask for confirmation before deleting contents
- Support Debian Jessie

### Changed
- Only send telemetry in production
- Clean up the code. Split main.js, refactor lots of things

### Fixed
- Fix state.playing.jumpToTime behavior
- Remove content file and poster image when deleting a content

## v0.8.1 - 2016-06-24

### Added
- New URI handler: stream-magnet

### Fixed
- DLNA crashing bug

## v0.8.0 - 2016-06-23

### Added
- Cast menu: choose which Chromecast, Airplay, or DLNA device you want to use
- Telemetry: send basic data, plus stats on how often the play button works
- Make posters from jpeg files, not just jpg
- Support .wmv video via Play in VLC
- Windows thumbnail bar with a play/pause button

### Changed
- Nicer modal styles

### Fixed
- Windows tray icon now stays in the right state

## v0.7.2 - 2016-06-02

### Fixed
- Fix exception that affects users upgrading from v0.5.1 or older
  - Ensure `state.saved.prefs` configuration exists
- Fix window title on "About WebContent" window

## v0.7.1 - 2016-06-02

### Changed
- Change "Step Forward" keyboard shortcut to `Alt+Left` (Windows)
- Change "Step Backward" keyboard shortcut to to `Alt+Right` (Windows)

### Fixed
- First time startup bug -- invalid content/poster paths

## v0.7.0 - 2016-06-02

### Added
- Improved AirPlay support -- using the new [`airplayer`](https://www.npmjs.com/package/airplayer) package
- Remember volume setting in player, for as long as the app is open

### Changed
- Add (+) button now also accepts non .content files and creates a content from
  those files
- Show prompt text in title bar for open dialogs (OS X)
- Upgrade Electron to 1.2.1
  - Improve window resizing when aspect ratio is enforced (OS X)
  - Use .ico format for better icon rendering quality (Windows)
  - Fix crash reporter not working (Windows)

### Fixed
- Re-enable WebRTC (web peers)! (OS X, Windows)
  - Windows support was disabled in v0.6.1 to work around a bug in Electron
  - OS X support was disabled in v0.4.0 to work around a 100% CPU bug
- Fix subtitle selector radio button UI size glitch
- Fix race condition causing exeption on app startup
- Fix duplicate content detection in some cases
- Fix "gray screen" exception caused by incorrect file list order
- Fix content loading message UI misalignment

### Known issues
- When upgrading to WebContent Desktop v0.7.0, some content metadata (file list,
  selected files, whether content is streamable) will be cleared. Just start the
  content to re-populate the metadata.

## v0.6.1 - 2016-05-26

### Fixed
- Disable WebRTC to work around Electron crash (Windows)
  - Will be re-enabled in the next version of WebContent, which will be based on
    the next version of Electron, where the bug is fixed.
- Fix crash when updating from WebContent 0.5.x in some situtations (#583)
- Fix crash when dropping files onto the dock icon (OS X)
- Fix keyboard shortcuts Space and ESC being captured globally (#585)
- Fix crash, show error when drag-dropping hidden files (#586)

## v0.6.0 - 2016-05-24

### Added
- Added Preferences page to set Download folder
- Save video position, resume playback from saved position
- Add additional video player keyboard shortcuts (#275)
- Use `poster.jpg` file as the poster image if available (#558)
- Associate .content files to WebContent Desktop (OS X) (#553)
- Add support for pasting `instant.io` links (#559)
- Add announcement feature

### Changed
- Nicer player UI
- Reduce startup jank, improve startup time (#568)
- Cleanup unsupported codec detection (#569, #570)
- Cleaner look for the content file list
- Improve subtitle positioning (#551)

### Fixed
- Fix Uncaught TypeError: Cannot read property 'update' of undefined (#567)
- Fix bugs in LocationHistory
  - When player is active, and magnet link is pasted, go back to list
  - After deleting content, remove just the player from forward stack
  - After creating content, remove create content page from forward stack
  - Cancel button on create content page should only go back one page

## v0.5.1 - 2016-05-18

### Fixed
- Fix auto-updater (OS X, Windows).

## v0.5.0 - 2016-05-17

### Added
- Select/deselect individual files to content.
- Automatically include subtitle files (.srt, .vtt) from content in the subtitles menu.
- "Add Subtitle File..." menu item.

### Changed
- When manually adding subtitle track(s), always switch to the new track.

### Fixed
- Magnet links throw exception on app launch. (OS X)
- Multi-file contents would not seed in-place, were copied to Downloads folder.
- Missing 'About WebContent' menu item. (Windows)
- Rare exception. ("Cannot create BrowserWindow before app is ready")

## v0.4.0 - 2016-05-13

### Added
- Better Windows support!
  - Windows 32-bit build.
  - Windows Portable App build.
  - Windows app signing, for fewer install warnings.
- Better Linux support!
  - Linux 32-bit build.
- Subtitles support!
  - .srt and .vtt file support.
  - Drag-and-drop files on video, or choose from file selector.
  - Multiple subtitle files support.
- Stream to VLC when the audio codec is unplayable (e.g. AC3, EAC3).
- "Show in Folder" item in context menu.
- Volume slider, with mute/unmute button.
- New "Create content" page to modify:
  - Content comment.
  - Trackers.
  - Private content flag.
- Use mouse wheel to increase/decrease volume.
- Bounce the Downloads stack when download completes. (OS X)
- New default content on first launch: The WIRED CD.

### Changed
- Improve app startup time by 40%.
- UI tweaks: Reduce font size, reduce content list item height.
- Add Playback menu for playback-related functionality.
- Fix installing when the app is already installed. (Windows)
- Don't kill unrelated processes on uninstall. (Windows)
- Set "sheet offset" correctly for create content dialog. (OS X)
- Remove OS X-style Window menu. (Linux, Windows)
- Remove "Add Fake Airplay/Chromecast" menu items.

### Fixed
- Disable WebRTC to fix 100% CPU usage/crashes caused by Chromium issue. This is
  temporary. (OS X)
- When fullscreen, make controls use the full window. (OS X)
- Support creating contents that contain .content files.
- Block power save while casting to a remote device.
- Do not block power save when the space key is pressed from the content list.
- Support playing .mpg and .ogv extensions in the app.
- Fix video centering for multi-screen setups.
- Show an error when adding a duplicate content.
- Show an error when adding an invalid magnet link.
- Do not stop music when tabbing to another program (OS X)
- Properly size the Windows volume mixer icon.
- Default to the user's OS-defined, localized "Downloads" folder.
- Enforce minimimum window size when resizing player to prevent window disappearing.
- Fix rare race condition error on app quit.
- Don't use zero-byte content "poster" images.

Thanks to @grunjol, @rguedes, @furstenheim, @karloluis, @DiegoRBaquero, @alxhotel,
@AgentEpsilon, @remijouannet, Rolando Guedes, @dcposch, and @feross for contributing
to this release!

## v0.3.3 - 2016-04-07

### Fixed
- App icon was incorrect (OS X)

## v0.3.2 - 2016-04-07

### Added
- Register WebContent as default handler for magnet links (OS X)

### Changed
- Faster startup time (50ms)
- Update Electron to 0.37.5
  - Remove the white flash when loading pages and resizing the window
  - Fix crash when sending IPC messages

### Fixed
- Fix installation bugs with .deb file (Linux)
- Pause audio reliably when closing the window
- Enforce minimimum window size when resizing player (for audio-only .mov files, which are 0x0)

## v0.3.1 - 2016-04-06

### Added
- Add crash reporter to content engine process

### Fixed
- Fix cast screen background: cover, don't tile

## v0.3.0 - 2016-04-06

### Added
- **Ubuntu/Debian support!** (.deb installer)
- **DLNA streaming support**
- Add "File > Quit" menu item (Linux)
- App uninstaller (Windows)
- Crash reporting

### Changed
- On startup, do not re-verify files when timestamps are unchanged
- Moved content engine to an independent process, for better UI performance
- Removed media queries (UI resizing based on window width)
- Improved Chromecast icon, when connected

### Fixed
- "Download Complete" notification shows consistently
- Create new contents and seed them without copying to temporary folder
- Clicking the "Download Complete" notification will always activate app
- Fixed harmless "-psn_###" error on first app startup
- Hide play buttons on unplayable contents
- Better error handling when Chromecast/Airplay cannot connect
- Show player controls immediately on mouse move
- When creating a content, show it in UI immediately
- Stop casting to TV when player is closed
- Content engine: Fixed memory leaks in `content-discovery` and `bitcontent-tracker`
- Content engine: Fixed sub-optimal tcp/webrtc connection timeouts
- Content engine: Throttle web seed connections to maximum of 4

Thanks to @dcposch, @grunjol, and @feross for contributing to this release.

## v0.2.0 - 2016-03-29

### Added
- Minimise to tray (Windows, Linux)
- Show spinner and download speed when player is stalled waiting for data
- Highlight window on drag-and-drop
- Show notification to update to new app version (Linux)
  - We have an auto-updater for Windows and Mac. We don't have one for Linux yet, so
    Linux users need to download new versions manually.

### Changed
- Renamed WebContent.app to WebContent Desktop
- Add Cosmos Laundromat as a default content

### Fixed
- Only capture media keys when player is active
- Update WebContent to 0.88.1 for performance improvements
  - When seeding, do not proactively connect to new peers
  - When seeding, do not accept new peers from peer exchange (ut_pex)
  - Fixed leaks, and other improvements that result in less garbage collection

Thanks to @dcposch, @ungoldman, and @feross for contributing to this release.

## v0.1.1 - 2016-03-28

- Performance improvements
  - Improve app startup time by over 100%
  - Reduce the number of DOM updates substantially
  - Update UI immediately anytime state is changed, instead on 1 second interval
- Added right-click menu
  - Save .content File
  - Copy Instant.io Link to Clipboard
  - Copy Magnet Link to Clipbaord
- Added keyboard shortcut for volume up (⌘/Ctrl + ↑) and volume down (⌘/Ctrl + ↓)
- Add desktop launcher shortcuts, like OS X has, for KDE and GNOME (Linux)
- Add "About" window (Windows, Linux)
- Better default window size that fits all the default contents
- Fixed
  - Crash when ".local/share/{applications,icons}" path did not exist (Linux)
  - WebContent executable can be moved without breaking contents in the client
  - Video progress bar shows progress for current file, not full content
  - Video player window shows file title instead of content title

Thanks to @dcposch, @ungoldman, @rom1504, @grunjol, @Flet, and @feross for contributing to
this release.

## v0.1.0 - 2016-03-25

- **Windows support!**
  - Includes auto-updater, just like the OS X version.
  - Installs desktop and start menu shortcuts.
- **Audio file support!**
  - Supports playback of .mp3, .aac, .ogg, .wav
  - Audio file metadata gets shown in the UI
- Top menu is no longer automatically hidden (Windows)
- When magnet links are opened from third-party apps, the WebContent window now gets focus.
- Subtler app sounds.
- Fix for an issue that caused some magnet links to fail to open.

**NOTE:** OS X users must install v0.1.0 manually because the app bundle ID was changed in this release, and the auto-updater cannot handle this condition.

Thanks to @dcposch, @ungoldman, and @feross for contributing to this release.

## v0.0.1 - 2016-03-21

- Wait 10 seconds (instead of 60 seconds) after app launch before checking for updates.

## v0.0.0 - 2016-03-21

The first official release of WebContent Desktop, the streaming content client for OS X,
Windows, and Linux. For now, we're only releasing binaries for OS X.

WebContent Desktop is in ALPHA and under very active development – expect lots more polish in
the coming weeks! If you know JavaScript and want to help us out, there's
[lots to do](https://github.com/webcontent/webcontent-desktop/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+contribution%22)!

### Features

- **Lightweight, fast content client**
- **Beautiful user experience**
- **Instantly stream video and audio** from contents!
  - WebContent fetches file pieces from the network **on-demand**, for instant playback.
  - Even when the file is not fully downloaded, **seeking still works!** (Seeking just reprioritizes what pieces are fetched from the network.)
- Stream videos to **AirPlay** and **Chromecast**
- **Pure Javascript**, so it's very easy to contribute code!
- Based on the most popular and comprehensive content package in Node.js, [`webcontent`](https://www.npmjs.com/package/webcontent).
- Lots of **features**, without the bloat:
  - Opens magnet links and .content files
  - Drag-and-drop makes adding contents easy!
  - Seed files/folders by dragging them onto the app
  - Discovers peers via tracker servers, DHT (Distributed Hash Table), and peer exchange
  - Make the video window "float on top" for watching video while you work!
  - Supports WebContent protocol – for connecting to WebRTC peers (i.e. web browsers)
