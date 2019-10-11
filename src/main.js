// Module to control application life.
// Module to create native browser window.
import createTrayIcon from './trayIcon'
import windowStateKeeper from 'electron-window-state'

const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')

const isDev = process.env.NODE_ENV === 'development'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tray

app.requestSingleInstanceLock()
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (!mainWindow.isVisible()) {
      mainWindow.show()
    }
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.focus()
  }
})

function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800,
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: false,
      devTools: isDev,
      preload: __dirname + '/preload.js'
    }
  })
  mainWindow.removeMenu()

  // and load the index.html of the app.
  // mainWindow.loadURL('http://localhost:3000');
  mainWindow.loadURL('https://www.icloud.com/notes')

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // Quit when all windows are closed.
  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  mainWindow.on('minimize', function (event) {
    event.preventDefault()
    mainWindow.hide()
  })

  mainWindowState.manage(mainWindow)
  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  Menu.setApplicationMenu(null)
  mainWindow = createWindow()
  tray = createTrayIcon(mainWindow)
})


app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    mainWindow.show()
  }
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

