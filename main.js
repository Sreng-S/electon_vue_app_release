const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
import { autoUpdater } from 'electron-updater'

// development env
// require('electron-reload')(__dirname, {
//   electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
// });

ipcMain.on('terminal', (e, args) => {
  if (args.method === 'exit') {
    app.quit();
  } else {
    console.log(args);
  }
});

const Sails = require('sails').constructor;
const sailsApp = new Sails();
let mainWindow;

// SSL/TSL: this is the self signed certificate support
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(true);
});

function createWindow() {

  let shouldQuit = makeSingleInstance();

  if (shouldQuit) return app.quit();
  mainWindow = new BrowserWindow({
    width: 600,
    height: 680,
    backgroundColor: '#000000',
    resizable: false,
    icon: path.join(__dirname, 'images/logo.png.icns'),
    title: 'MediVRx',
    center: true
  });

  mainWindow.on('closed', function() {
    mainWindow = null
  });

  mainWindow.setMenu(null);
  mainWindow.loadURL('https://104.45.154.157:443');
  // initialize()
}

function initialize() {
  mainWindow.loadURL('https://104.45.154.157:443');
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.focus()
  })
}

app.disableHardwareAcceleration();

app.on('quit', function() {
  sailsApp.lower(
    function (err) {
      if (err) {
        return console.log('Error occurred lowering Sails app: ', err)
      }
      process.exit(err ? 1 : 0);
      console.log('Sails app lowered successfully!')
    }
  )
});

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
});

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
});

function makeSingleInstance() {
  if (process.mas) return false;

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus()
    }
  })
}