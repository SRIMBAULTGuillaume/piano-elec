(function () {
    // Retrieve remote BrowserWindow
    const { ipcRenderer } = require('electron');
    const { BrowserWindow } = require('electron').remote;

    var button61;
    var button62;

    var buttonList;

    var mouseDown = false;

    function init() {
        window.buttonList = {};
        window.buttonList.button70 = document.getElementById('button-70');
        window.buttonList.button71 = document.getElementById('button-71');

        buttonList = document.getElementsByClassName('btn-clickable');

        init_event();
    };

    function init_event() {

        // window function
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


        window.onkeydown = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            console.log(key);
            if (window.buttonList['button' + key] != undefined)
                window.buttonList['button' + key].dispatchEvent(new Event("mousedown"));
        }

        window.onkeyup = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;

            if (window.buttonList['button' + key] != undefined)
                window.buttonList['button' + key].dispatchEvent(new Event("mouseup"));
        }

        
        document.body.onmousedown = function () {
            mouseDown = true;
        }
        document.body.onmouseup = function () {
            mouseDown = false;
        }

        for (var i = 0; i < buttonList.length; i++) {

            buttonList[i].addEventListener('mousedown', function (e) {
                e.target.classList.add('clicked');
            })

            buttonList[i].addEventListener('mouseup', function (e) {
                e.target.classList.remove('clicked');
            })

            buttonList[i].addEventListener('pointerout', function (e) {
                e.target.classList.remove('clicked');
            })

            buttonList[i].addEventListener('pointerenter', function (e) {
                if (mouseDown)
                    e.target.classList.add('clicked');
            })
        }
    }

    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            init();
        }
    };
})();