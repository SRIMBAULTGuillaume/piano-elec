const path = require('path');
const url = require('url');
const electron = require('electron');
const { ipcMain, globalShortcut } = require('electron');


const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
let windowMaximised = false;
let mainWindowPosition;

let settingWindow;

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
        resizable: false,
        show: false
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    })
}

var openSettingWindow = function () {
    settingWindow = new BrowserWindow({
        frame: false,
        width: 400,
        height: 200,
        resizable: false,
        parent: mainWindow,
        modal: true
    });

    settingWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/settings.html'),
        protocol: 'file:',
        slashes: true
    }));
}

ipcMain.on('change-size', (event, arg) => {
    if (windowMaximised){
        mainWindow.setSize(1200, 600);
        mainWindow.setPosition(mainWindowPosition[0], mainWindowPosition[1])
    } else {
        mainWindowPosition = mainWindow.getPosition();
        mainWindow.maximize();
    }
    windowMaximised = !windowMaximised;
})

ipcMain.on('open-settings', (event, ...args) => {
    openSettingWindow();
})

app.on('ready', () => {
    createWindow();
    console.log('start');
    globalShortcut.register('CommandOrControl+F1', () => {
        openSettingWindow();
    })
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})