/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
// require('electron-debug')({ showDevTools: true })

// Install `vue-devtools`
require('electron').app.on('ready', () => {
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {})
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})

require('electron').app.on("certificate-error", (event, webContents, url, err, certificate, cb) => {
  if (err) console.log(err)
  /* eslint-disable */
  if (url === 'https://104.45.154.157/') {
    event.preventDefault()
    cb(true)
  } else {
    cb(false)
  }
})
// Require `main` process to boot app
require('./index')