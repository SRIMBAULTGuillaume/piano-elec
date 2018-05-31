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
    let score = 0;

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

        //generation
        let time = getRandomInt(5000)
        actualTimestamp = Date.now() + time;
        setTimeout(() => {
            let btn = getRandomInt(buttonList.length)
            buttonList[btn].classList.add('alert');
            buttonList[btn].alerted = true;
            console.log(buttonList[btn].alerted)
        }, time)

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
                e.target.classList.remove('alert')
                if (e.target.alerted){
                    score = Date.now() - actualTimestamp;
                    console.log("score : " + score);
                    e.target.alerted = false;
                } else 
                    console.log('lose');
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