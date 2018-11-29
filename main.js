
const { autoUpdater } = require('electron-updater');
const {app, BrowserWindow, ipcMain, protocol} = require('electron');
const path = require('path');
const url = require('url');
protocol.registerStandardSchemes(['file']);

// development env
if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

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

const baseURL = NODE_ENV='development' ? 'http://localhost:1337':url.format({
  pathname: path.join(__dirname, '/static/index.html'),
  protocol: 'file:',
  slashes: true
});

function createWindow() {

  let shouldQuit = makeSingleInstance();

  if (shouldQuit) {return app.quit();}
  mainWindow = new BrowserWindow({
    width: 620,
    height: 690,
    backgroundColor: '#000000',
    resizable: true,
    icon: path.join(__dirname, 'images/logo.png.icns'),
    title: 'MediVRx Server',
    center: true
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
  initialize();
}

function initialize() {
  mainWindow.loadURL(baseURL);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.focus();
  });
}

app.disableHardwareAcceleration();

app.on('quit', () => {
  sailsApp.lower(
    (err) => {
      if (err) {
        return console.log('Error occurred lowering Sails app: ', err);
      }
      process.exit(err ? 1 : 0);
      // console.log('Sails app lowered successfully!');
    }
  );
});

app.on('ready', () => {
  // protocol.unregisterProtocol('file');
  // protocol.registerHttpProtocol('file', (request, callback) => {
  //   let url = request.url.substr(8);
  //   callback({
  //     url: 'localhost:1337' + url
  //   })
  // }, (error) => {
  //   if (error) console.error('Failed to register protocol', error);
  // });
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates();
  }
});

function makeSingleInstance() {
  if (process.mas) {return false;}

  return app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {mainWindow.restore();}
      mainWindow.focus();
    }
  });
}
