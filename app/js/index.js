(function () {
    // Retrieve remote BrowserWindow
    const { ipcRenderer } = require('electron');
    const { BrowserWindow } = require('electron').remote;

    const oscillatorType = 'sine'; //sine, square, triangle, sawtooth

    var context = new AudioContext();

    var buttonList;

    var mouseDown = false;

    function init() {
        window.buttonList = {};

        buttonList = document.getElementsByClassName('btn-clickable');

        for (let i = 0; i < buttonList.length; i++){
            window.buttonList["button" + buttonList[i].dataset.key] = { };
            let object = window.buttonList["button" + buttonList[i].dataset.key];

            object.btn = buttonList[i];
            object.oscillator = context.createOscillator();
            object.gain = context.createGain();
            object.frequency = object.btn.dataset.frequency;

            object.oscillator.connect(object.gain);
            object.gain.connect(context.destination);

            object.oscillator.type = oscillatorType;
            object.oscillator.frequency.value = object.frequency;
        }

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
            if (window.buttonList['button' + key] != undefined){
                window.buttonList['button' + key].btn.dispatchEvent(new Event("mousedown"));
            }
        }

        window.onkeyup = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;

            if (window.buttonList['button' + key] != undefined)
                window.buttonList['button' + key].btn.dispatchEvent(new Event("mouseup"));
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
                startSound(e.target.dataset.key);
                // if (e.target.dataset.sound != undefined) {
                //     o = context.createOscillator();
                //     g = context.createGain();
                //     o.connect(g);
                //     g.connect(context.destination);
                //     o.start()
                // }
            })

            buttonList[i].addEventListener('mouseup', function (e) {
                e.target.classList.remove('clicked');
                stopSound(e.target.dataset.key);
                // if (e.target.dataset.sound != undefined) {
                //     g.gain.exponentialRampToValueAtTime(
                //         0.00001, context.currentTime + 0.04
                //     )
                // }
            })

            buttonList[i].addEventListener('pointerout', function (e) {
                e.target.classList.remove('clicked');
                stopSound(e.target.dataset.key);
                // if (e.target.dataset.sound != undefined) {
                //     g.gain.exponentialRampToValueAtTime(
                //         0.00001, context.currentTime + 0.04
                //     )
                // }
            })

            buttonList[i].addEventListener('pointerenter', function (e) {
                if (!mouseDown)
                    return;

                e.target.classList.add('clicked');
                startSound(e.target.dataset.key);
                // if (e.target.dataset.sound != undefined) {
                //     o = context.createOscillator();
                //     g = context.createGain();
                //     o.connect(g);
                //     g.connect(context.destination);
                //     o.start()
                // }
            })
        }
    }

    function startSound(numBtn){
        window.buttonList["button" + numBtn].oscillator.start();
    }

    function stopSound(numBtn){
        let object = window.buttonList["button" + numBtn]
        object.gain.gain.exponentialRampToValueAtTime(
            0.00001, context.currentTime + 0.04
        );
        object.oscillator = context.createOscillator();
        object.gain = context.createGain();

        object.oscillator.connect(object.gain);
        object.gain.connect(context.destination);

        object.oscillator.type = oscillatorType;
        object.oscillator.frequency.value = object.frequency;
    }

    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            init();
        }
    };
})();