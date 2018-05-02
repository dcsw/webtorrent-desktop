/* eslint-disable camelcase */

module.exports = {
  run
}

const fs = require('fs')
const path = require('path')
const semver = require('semver')

const config = require('../../config')

// Change `state.saved` (which will be saved back to config.json on exit) as
// needed, for example to deal with config.json format changes across versions
function run (state) {
  // Replace '{ version: 1 }' with app version (semver)
  if (!semver.valid(state.saved.version)) {
    state.saved.version = '0.0.0' // Pre-0.7.0 version, so run all migrations
  }

  const version = state.saved.version
  const saved = state.saved

  if (semver.lt(version, '0.7.0')) migrate_0_7_0(saved)
  if (semver.lt(version, '0.7.2')) migrate_0_7_2(saved)
  if (semver.lt(version, '0.11.0')) migrate_0_11_0(saved)
  if (semver.lt(version, '0.12.0')) migrate_0_12_0(saved)
  if (semver.lt(version, '0.14.0')) migrate_0_14_0(saved)
  if (semver.lt(version, '0.17.0')) migrate_0_17_0(saved)
  if (semver.lt(version, '0.17.2')) migrate_0_17_2(saved)

  // Config is now on the new version
  state.saved.version = config.APP_VERSION
}

function migrate_0_7_0 (saved) {
  const cpFile = require('cp-file')
  const path = require('path')

  saved.contents.forEach(function (ts) {
    const infoHash = ts.infoHash

    // Replace contentPath with genericContentFileName
    // There are a number of cases to handle here:
    // * Originally we used absolute paths
    // * Then, relative paths for the default contents, eg '../static/sintel.content'
    // * Then, paths computed at runtime for default contents, eg 'sintel.content'
    // * Finally, now we're getting rid of contentPath altogether
    let src, dst
    if (ts.contentPath) {
      if (path.isAbsolute(ts.contentPath) || ts.contentPath.startsWith('..')) {
        src = ts.contentPath
      } else {
        src = path.join(config.STATIC_PATH, ts.contentPath)
      }
      dst = path.join(config.CONTENT_PATH, infoHash + '.content')
      // Synchronous FS calls aren't ideal, but probably OK in a migration
      // that only runs once
      if (src !== dst) cpFile.sync(src, dst)

      delete ts.contentPath
      ts.genericContentFileName = infoHash + '.content'
    }

    // Replace posterURL with posterFileName
    if (ts.posterURL) {
      const extension = path.extname(ts.posterURL)
      src = path.isAbsolute(ts.posterURL)
        ? ts.posterURL
        : path.join(config.STATIC_PATH, ts.posterURL)
      dst = path.join(config.POSTER_PATH, infoHash + extension)
      // Synchronous FS calls aren't ideal, but probably OK in a migration
      // that only runs once
      if (src !== dst) cpFile.sync(src, dst)

      delete ts.posterURL
      ts.posterFileName = infoHash + extension
    }

    // Fix exception caused by incorrect file ordering.
    // https://github.com/webcontent/webcontent-desktop/pull/604#issuecomment-222805214
    delete ts.defaultPlayFileIndex
    delete ts.files
    delete ts.selections
    delete ts.fileModtimes
  })
}

function migrate_0_7_2 (saved) {
  if (saved.prefs == null) {
    saved.prefs = {
      downloadPath: config.DEFAULT_DOWNLOAD_PATH
    }
  }
}

function migrate_0_11_0 (saved) {
  if (saved.prefs.isFileHandler == null) {
    // The app used to make itself the default content file handler automatically
    saved.prefs.isFileHandler = true
  }
}

function migrate_0_12_0 (saved) {
  const ContentSummary = require('./content-summary')

  if (saved.prefs.openExternalPlayer == null && saved.prefs.playInVlc != null) {
    saved.prefs.openExternalPlayer = saved.prefs.playInVlc
  }
  delete saved.prefs.playInVlc

  // Undo a terrible bug where clicking Play on a default content on a fresh
  // install results in a "path missing" error
  // See https://github.com/webcontent/webcontent-desktop/pull/806
  const defaultContentFiles = [
    '6a9759bffd5c0af65319979fb7832189f4f3c35d.content',
    '88594aaacbde40ef3e2510c47374ec0aa396c08e.content',
    '6a02592d2bbc069628cd5ed8a54f88ee06ac0ba5.content',
    '02767050e0be2fd4db9a2ad6c12416ac806ed6ed.content',
    '3ba219a8634bf7bae3d848192b2da75ae995589d.content'
  ]
  saved.contents.forEach(function (contentSummary) {
    if (!defaultContentFiles.includes(contentSummary.genericContentFileName)) return
    const fileOrFolder = ContentSummary.getFileOrFolder(contentSummary)
    if (!fileOrFolder) return
    try {
      fs.statSync(fileOrFolder)
    } catch (err) {
      // Default content with "missing path" error. Clear path.
      delete contentSummary.path
    }
  })
}

function migrate_0_14_0 (saved) {
  saved.contents.forEach(function (ts) {
    delete ts.defaultPlayFileIndex
  })
}

function migrate_0_17_0 (saved) {
  // Fix a sad, sad bug that resulted in 100MB+ config.json files
  saved.contents.forEach(function (ts) {
    if (!ts.files) return
    ts.files.forEach(function (file) {
      if (!file.audioInfo || !file.audioInfo.picture) return
      // This contained a Buffer, which 30x'd in size when serialized to JSON
      delete file.audioInfo.picture
    })
  })
}

function migrate_0_17_2 (saved) {
  // Remove the trailing dot (.) from the Wired CD content name, since
  // folders/files that end in a trailing dot (.) or space are not deletable from
  // Windows Explorer. See: https://github.com/webcontent/webcontent-desktop/issues/905

  const cpFile = require('cp-file')
  const rimraf = require('rimraf')

  const OLD_NAME = 'The WIRED CD - Rip. Sample. Mash. Share.'
  const NEW_NAME = 'The WIRED CD - Rip. Sample. Mash. Share'

  const OLD_HASH = '3ba219a8634bf7bae3d848192b2da75ae995589d'
  const NEW_HASH = 'a88fda5954e89178c372716a6a78b8180ed4dad3'

  const ts = saved.contents.find((ts) => {
    return ts.infoHash === OLD_HASH
  })

  if (!ts) return // Wired CD content does not exist

  // New versions of WebContent ship with a fixed content file. Let's fix up the
  // name in existing versions of WebContent.
  ts.name = ts.displayName = NEW_NAME
  ts.files.forEach((file) => {
    file.path = file.path.replace(OLD_NAME, NEW_NAME)
  })

  // Changing the content name causes the info hash to change
  ts.infoHash = NEW_HASH
  ts.magnetURI = ts.magnetURI.replace(OLD_HASH, NEW_HASH)

  try {
    fs.renameSync(
      path.join(config.POSTER_PATH, ts.posterFileName),
      path.join(config.POSTER_PATH, NEW_HASH + '.jpg')
    )
  } catch (err) {}
  ts.posterFileName = NEW_HASH + '.jpg'

  rimraf.sync(path.join(config.CONTENT_PATH, ts.genericContentFileName))
  cpFile.sync(
    path.join(config.STATIC_PATH, 'wiredCd.content'),
    path.join(config.CONTENT_PATH, NEW_HASH + '.content')
  )
  ts.genericContentFileName = NEW_HASH + '.content'

  if (ts.path) {
    // If content folder already exists on disk, try to rename it
    try {
      fs.renameSync(
        path.join(ts.path, OLD_NAME),
        path.join(ts.path, NEW_NAME)
      )
    } catch (err) {}
  }
}
