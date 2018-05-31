function menuBar(document) {
    const { ipcRenderer } = require('electron');
    const { BrowserWindow } = require('electron').remote;

    document.getElementById('min-btn').addEventListener('click', function () {
        let window = BrowserWindow.getFocusedWindow();
        window.minimize();
    });
    document.getElementById('max-btn').addEventListener('click', function () {
        ipcRenderer.send('change-size');
    });
    document.getElementById('exit-btn').addEventListener('click', function () {
        let window = BrowserWindow.getFocusedWindow();
        window.close();
    });
}