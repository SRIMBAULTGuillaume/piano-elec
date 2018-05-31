(function () {
    // Retrieve remote BrowserWindow
    const { ipcRenderer } = require('electron');
    const { BrowserWindow } = require('electron').remote;
    let menu;

    const oscillatorType = 'sine'; //sine, square, triangle, sawtooth

    const context = new AudioContext();

    var buttonList;

    var mouseDown = false;



    function init() {
        menu = new menuBar(document);
        
        window.buttonList = {};

        buttonList = document.getElementsByClassName('btn-clickable');

        for (let i = 0; i < buttonList.length; i++){

            buttonList[i].touch = new touch(buttonList[i].dataset.key, 
                                            buttonList[i].dataset.frequency, 
                                            oscillatorType, 
                                            context);

            buttonList[i].touch.setupSound();
        }

        init_event();
    };

    function init_event() {

        window.onkeydown = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;

            if (document.getElementById('button-' + key) != undefined)
                document.getElementById('button-' + key).dispatchEvent(new Event("mousedown"))
        }

        window.onkeyup = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;

            if (document.getElementById('button-' + key) != undefined)
                document.getElementById('button-' + key).dispatchEvent(new Event("mouseup"))
        }

        
        document.body.onmousedown = function () {
            mouseDown = true;
        }
        document.body.onmouseup = function () {
            mouseDown = false;
        }

        for (let i = 0; i < buttonList.length; i++) {

            buttonList[i].addEventListener('mousedown', function (e) {
                e.target.classList.add('clicked');
                e.target.touch.soundUp();
            })

            buttonList[i].addEventListener('mouseup', function (e) {
                e.target.classList.remove('clicked');
                e.target.touch.soundDown();
            })

            buttonList[i].addEventListener('pointerout', function (e) {
                e.target.classList.remove('clicked');
                e.target.touch.soundDown();
            })

            buttonList[i].addEventListener('pointerenter', function (e) {
                if (!mouseDown)
                    return;

                e.target.classList.add('clicked');
                e.target.touch.soundUp();
            })
        }

        document.getElementById('setting-icon').addEventListener('click', e => {
            ipcRenderer.send('open-settings', 'yo');
        })
    }

    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            init();
        }
    };
})();