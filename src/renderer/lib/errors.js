const ExtendableError = require('es6-error')

/* Generic errors */

class CastingError extends ExtendableError {}
class PlaybackError extends ExtendableError {}
class SoundError extends ExtendableError {}
class ContentError extends ExtendableError {}

/* Playback */

class UnplayableContentError extends PlaybackError {
  constructor () { super('Can\'t play any files in content') }
}

class UnplayableFileError extends PlaybackError {
  constructor () { super('Can\'t play that file') }
}

/* Sound */

class InvalidSoundNameError extends SoundError {
  constructor (name) { super(`Invalid sound name: ${name}`) }
}

/* Content */

class ContentKeyNotFoundError extends ContentError {
  constructor (contentKey) { super(`Can't resolve content key ${contentKey}`) }
}

module.exports = {
  CastingError,
  PlaybackError,
  SoundError,
  ContentError,
  UnplayableContentError,
  UnplayableFileError,
  InvalidSoundNameError,
  ContentKeyNotFoundError
}
