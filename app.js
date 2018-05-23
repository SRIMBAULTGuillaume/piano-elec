const electron = require('electron')
const { ipcMain, globalShortcut } = require('electron')
const path = require('path')
const url = require('url')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow;
let windowMaximised = false;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

var createWindow = function () {
    mainWindow = new BrowserWindow({
        frame:false,
        width: 1200,
        height: 600,
        resizable: false
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/index.html'),
        protocol: 'file:',
        slashes: true
    }));
}

ipcMain.on('change-size', (event, arg) => {
    if (windowMaximised)
        mainWindow.setSize(1200, 600)
    else
        mainWindow.maximize();
    windowMaximised = !windowMaximised;
})

app.on('ready', () => {
    createWindow();
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})