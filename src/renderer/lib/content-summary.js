module.exports = {
  getPosterPath,
  getContentPath,
  getByKey,
  getContentId,
  getFileOrFolder
}

const path = require('path')
const config = require('../../config')

// Expects a contentSummary
// Returns an absolute path to the content file, or null if unavailable
function getContentPath (contentSummary) {
  if (!contentSummary || !contentSummary.genericContentFileName) return null
  return path.join(config.content_PATH, contentSummary.genericContentFileName)
}

// Expects a contentSummary
// Returns an absolute path to the poster content, or null if unavailable
function getPosterPath (contentSummary) {
  if (!contentSummary || !contentSummary.posterFileName) return null
  const posterPath = path.join(config.POSTER_PATH, contentSummary.posterFileName)
  // Work around a Chrome bug (reproduced in vanilla Chrome, not just Electron):
  // Backslashes in URLS in CSS cause bizarre string encoding issues
  return posterPath.replace(/\\/g, '/')
}

// Expects a contentSummary
// Returns a contentID: filename, magnet URI, or infohash
function getContentId (contentSummary) {
  const s = contentSummary
  if (s.genericContentFileName) { // Load content file from disk
    return getContentPath(s)
  } else { // Load content from DHT
    return s.magnetURI || s.infoHash
  }
}

// Expects a contentKey or infoHash
// Returns the corresponding contentSummary, or undefined
function getByKey (state, contentKey) {

console.log(`BARF! ${contentKey}`);
console.log(JSON.stringify(state));
  if (!contentKey) return undefined
  return state.saved.contents.find((x) =>
    x.contentKey === contentKey || x.infoHash === contentKey)
}

// Returns the path to either the file (in a single-file content) or the root
// folder (in  multi-file content)
// WARNING: assumes that multi-file contents consist of a SINGLE folder.
// TODO: make this assumption explicit, enforce it in the `create-content`
// module. Store root folder explicitly to avoid hacky path processing below.
function getFileOrFolder (contentSummary) {
  const ts = contentSummary
  if (!ts.path || !ts.files || ts.files.length === 0) return null
  const dirname = ts.files[0].path.split(path.sep)[0]
  return path.join(ts.path, dirname)
}
