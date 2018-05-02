module.exports = {
  init
}

const electron = require('electron')

const app = electron.app

/**
 * Add a user task menu to the app icon on right-click. (Windows)
 */
function init () {
  if (process.platform !== 'win32') return
  app.setUserTasks(getUserTasks())
}

function getUserTasks () {
  return [
    {
      arguments: '-n',
      title: 'Create New Content...',
      description: 'Create a new content'
    },
    {
      arguments: '-o',
      title: 'Open Content File...',
      description: 'Open a .content file'
    },
    {
      arguments: '-u',
      title: 'Open Content Address...',
      description: 'Open a content from a URL'
    }
  ].map(getUserTasksItem)
}

function getUserTasksItem (item) {
  return Object.assign(item, {
    program: process.execPath,
    iconPath: process.execPath,
    iconIndex: 0
  })
}
