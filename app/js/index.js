(function () {
    // Retrieve remote BrowserWindow
    const { ipcRenderer } = require('electron');
    const { BrowserWindow } = require('electron').remote;
    let menu;

    const oscillatorType = 'sine'; //sine, square, triangle, sawtooth

    const context = new AudioContext();

    var buttonList;

    var mouseDown = false;

    let actualTimestamp = 0;

    function init() {
        menu = new menuBar(document);
        Const.scoreView = document.getElementById('score');
        Const.popupView = document.getElementById('popup');
        
        window.buttonList = {};

        buttonList = document.getElementsByClassName('btn-clickable');

        for (let i = 0; i < buttonList.length; i++){
            buttonList[i].touch = new createTouch(buttonList[i],
                                                oscillatorType, 
                                                context, 
                                                window);
        }

        init_event();

        Const.score = 1000;

        // buttonList[0].touch.setAlert(1000, 1000);
        // buttonList[1].touch.setAlert(1500, 1000);

        buttonList[0].touch.spawnTouch(1500, 500);
        buttonList[1].touch.spawnTouch(2000, 500);

    };

    function init_event() {

        window.onkeydown = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;

            if(key == 48){
                buttonList[0].touch.spawnTouch(1500, 500);
                buttonList[1].touch.spawnTouch(2000, 500);
            }

            if (document.getElementById('button-' + key) != undefined)
                document.getElementById('button-' + key).dispatchEvent(new Event("mousedown"))
        }

        window.onkeyup = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;

            if (document.getElementById('button-' + key) != undefined)
                document.getElementById('button-' + key).dispatchEvent(new Event("mouseup"))
        }

        
        document.body.onmousedown = function () {
            Const.keyPressed = true;
        }
        document.body.onmouseup = function () {
            Const.keyPressed = false;
        }

        document.getElementById('setting-icon').addEventListener('click', e => {
            ipcRenderer.send('open-settings');
        })
    }

    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            init();
        }
    };

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
})();