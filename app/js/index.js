(function () {
    // Retrieve remote BrowserWindow
    const { ipcRenderer } = require('electron');
    const { BrowserWindow } = require('electron').remote;

    var button = document.getElementById("button1");

    function init() {
        console.log('init')

        window.onkeydown = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 71)
                button.dispatchEvent(new Event("mousedown"));
        }

        window.onkeyup = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 71) 
                button.dispatchEvent(new Event("mouseup"));
        }
        
        init_event();
    };

    function init_event() {
        // Minimize task
        document.getElementById('min-btn').addEventListener('click', function () {
            let window = BrowserWindow.getFocusedWindow();
            window.minimize();
        });

        // Maximize window
        document.getElementById('max-btn').addEventListener('click', function () {
            ipcRenderer.send('change-size');
        });

        // Close app
        document.getElementById('exit-btn').addEventListener('click', function () {
            let window = BrowserWindow.getFocusedWindow();
            window.close();
        });
    }

    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            init();
        }
    };
})();