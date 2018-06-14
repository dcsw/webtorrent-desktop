module.exports = {
  isPlayable,
  isContent,
  isPlayableContentSummary
}

const path = require('path')

// Checks whether a fileSummary or file path is playable based on the file extension
function isPlayable (file) {
  return isContent(file)
}

// Checks whether a fileSummary or file path is playable video
function isContent (file) {
  return [
    '.JPG',
    '.PNG',
    '.SVG',
    '.WEBP',
    '.PDF',
    '.GIF', 
    '.WEBP',
    // '.AI',
    // '.EPS'
  ].includes(getFileExtension(file).toUpperCase())
}

function getFileExtension (file) {
  const name = typeof file === 'string' ? file : file.name
  return path.extname(name).toLowerCase()
}

function isPlayableContentSummary (contentSummary) {
  return true
}
