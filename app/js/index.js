(function () {
    // Retrieve remote BrowserWindow
    const { ipcRenderer } = require('electron');
    const { BrowserWindow } = require('electron').remote;

    var context = new AudioContext()

    var buttonList;
    var o = context.createOscillator();
    var g = context.createGain();

    var mouseDown = false;

    function init() {
        window.buttonList = {};

        buttonList = document.getElementsByClassName('btn-clickable');

        for (let i = 0; i < buttonList.length; i++) 
            window.buttonList["button" + buttonList[i].dataset.key] = buttonList[i];

        o.connect(g);
        g.connect(context.destination);

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
                window.buttonList['button' + key].dispatchEvent(new Event("mousedown"));

                
            }
                

            
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

        for (let i = 0; i < buttonList.length; i++) {

            buttonList[i].addEventListener('mousedown', function (e) {
                e.target.classList.add('clicked');
                if (e.target.dataset.sound != undefined) {
                    o = context.createOscillator();
                    g = context.createGain();
                    o.connect(g);
                    g.connect(context.destination);
                    o.start()
                }
            })

            buttonList[i].addEventListener('mouseup', function (e) {
                e.target.classList.remove('clicked');
                if (e.target.dataset.sound != undefined) {
                    g.gain.exponentialRampToValueAtTime(
                        0.00001, context.currentTime + 0.04
                    )
                }
            })

            buttonList[i].addEventListener('pointerout', function (e) {
                e.target.classList.remove('clicked');
                if (e.target.dataset.sound != undefined) {
                    g.gain.exponentialRampToValueAtTime(
                        0.00001, context.currentTime + 0.04
                    )
                }
            })

            buttonList[i].addEventListener('pointerenter', function (e) {
                if (!mouseDown)
                    return;

                e.target.classList.add('clicked');
                if (e.target.dataset.sound != undefined) {
                    o = context.createOscillator();
                    g = context.createGain();
                    o.connect(g);
                    g.connect(context.destination);
                    o.start()
                }
            })
        }
    }

    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            init();
        }
    };
})();