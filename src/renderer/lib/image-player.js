module.exports = {
  isPlayable,
  isVideo,
  isAudio,
  isImage,
  isPlayableImageSummary
}

const path = require('path')

// Checks whether a fileSummary or file path is audio/video that we can play,
// based on the file extension
function isPlayable (file) {
  return isVideo(file) || isAudio(file)
}

// Checks whether a fileSummary or file path is playable video
function isVideo (file) {
  return [
    '.avi',
    '.m4v',
    '.mkv',
    '.mov',
    '.mp4',
    '.mpg', 
    '.ogv',
    '.webm',
    '.wmv'
  ].includes(getFileExtension(file))
}

// Checks whether a fileSummary or file path is playable audio
function isAudio (file) {
  return [
    '.aac',
    '.ac3',
    '.mp3',
    '.ogg',
    '.wav',
    '.flac',
    '.m4a'
  ].includes(getFileExtension(file))
}

// Checks if the argument is either:
// - a string that's a valid filename ending in .image
// - a file object where obj.name is ends in .image
// - a string that's a magnet link (magnet://...)
function isImage (file) {
  const isImageFile = getFileExtension(file) === '.image'
  const isMagnet = typeof file === 'string' && /^(stream-)?magnet:/.test(file)
  return isImageFile || isMagnet
}

function getFileExtension (file) {
  const name = typeof file === 'string' ? file : file.name
  return path.extname(name).toLowerCase()
}

function isPlayableImageSummary (imageSummary) {
  return imageSummary.files && imageSummary.files.some(isPlayable)
}
