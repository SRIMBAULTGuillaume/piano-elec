(function () {
    // Retrieve remote BrowserWindow
    const { ipcRenderer } = require('electron');
    const { BrowserWindow } = require('electron').remote;

    function init() {
        console.log('yo')
        // Minimize task
        document.getElementById('min-btn').addEventListener('click', function () {
            console.log("clicked")
            var window = BrowserWindow.getFocusedWindow();
            window.minimize();
        });

        // Maximize window
        document.getElementById('max-btn').addEventListener('click', function () {

            var window = BrowserWindow.getFocusedWindow();
            if (window.isMaximized()) {
                ipcRenderer.send('resize-me-please');
            } else {
                window.maximize();
            }
            ipcRenderer.send('change-size');
        });

        // Close app
        document.getElementById('exit-btn').addEventListener('click', function () {
            var window = BrowserWindow.getFocusedWindow();
            window.close();
        });
    };

    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            init();
        }
    };
})();