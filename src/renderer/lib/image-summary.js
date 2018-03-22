module.exports = {
  getPosterPath,
  getImagePath,
  getByKey,
  getImageId,
  getFileOrFolder
}

const path = require('path')
const config = require('../../config')

// Expects a imageSummary
// Returns an absolute path to the image file, or null if unavailable
function getImagePath (imageSummary) {
  if (!imageSummary || !imageSummary.genericContentFileName) return null
  return path.join(config.image_PATH, imageSummary.genericContentFileName)
}

// Expects a imageSummary
// Returns an absolute path to the poster image, or null if unavailable
function getPosterPath (imageSummary) {
  if (!imageSummary || !imageSummary.posterFileName) return null
  const posterPath = path.join(config.POSTER_PATH, imageSummary.posterFileName)
  // Work around a Chrome bug (reproduced in vanilla Chrome, not just Electron):
  // Backslashes in URLS in CSS cause bizarre string encoding issues
  return posterPath.replace(/\\/g, '/')
}

// Expects a imageSummary
// Returns a imageID: filename, magnet URI, or infohash
function getImageId (imageSummary) {
  const s = imageSummary
  if (s.genericContentFileName) { // Load image file from disk
    return getImagePath(s)
  } else { // Load image from DHT
    return s.magnetURI || s.infoHash
  }
}

// Expects a imageKey or infoHash
// Returns the corresponding imageSummary, or undefined
function getByKey (state, imageKey) {
  if (!imageKey) return undefined
  return state.saved.torrents.find((x) =>
    x.imageKey === imageKey || x.infoHash === imageKey)
}

// Returns the path to either the file (in a single-file image) or the root
// folder (in  multi-file image)
// WARNING: assumes that multi-file images consist of a SINGLE folder.
// TODO: make this assumption explicit, enforce it in the `create-image`
// module. Store root folder explicitly to avoid hacky path processing below.
function getFileOrFolder (imageSummary) {
  const ts = imageSummary
  if (!ts.path || !ts.files || ts.files.length === 0) return null
  const dirname = ts.files[0].path.split(path.sep)[0]
  return path.join(ts.path, dirname)
}
