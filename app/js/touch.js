function createTouch(btn, oscillatorType, context, view) {
    function touch(btn, oscillatorType, context, view) {
        this.btn = btn;
        this.keyCode = btn.dataset.keyCode;
        this.frequency = btn.dataset.frequency;
        this.oscillatorType = oscillatorType;

        this.context = context;
        this.view = view

        this.alerted = false;
        this.timeLastAlert;
        this.lastMarge;

        this.soundUp = function () {
            btn.classList.add('clicked');
            this.oscillator.start();
        }

        this.soundDown = function () {
            this.gain.gain.exponentialRampToValueAtTime(
                0.00001, context.currentTime + 0.04
            );
            btn.classList.remove('clicked');
            this.setupSound();
        }

        this.setupSound = function () {
            this.oscillator = this.context.createOscillator();
            this.gain = this.context.createGain();

            this.oscillator.connect(this.gain);
            this.gain.connect(this.context.destination);

            this.oscillator.type = oscillatorType;
            this.oscillator.frequency.value = this.frequency;
        }
        this.setupSound();

        this.changeOcsillator = function (type) {
            this.oscillatorType = type;
            this.oscillator.type = this.oscillatorType;
        }

        this.spawnTouch = function (time, marge) {
            setTimeout(() => {
                this.alerted = true;
                this.timeLastAlert = Date.now() + marge;
                this.lastMarge = marge;
                btn.classList.add('alert');
                setTimeout(() => {
                    btn.classList.remove('alert');
                    setTimeout(() => {
                        if (this.alerted)
                            Const.score -= 500;
                        this.alerted = false;
                    }, marge);
                }, marge);
            }, time - marge);
        }

        btn.addEventListener('mousedown', function (e) {
            this.soundUp();
            console.log(this.alerted);
            if (this.alerted){
                let score = this.lastMarge - (Math.abs((Date.now() - this.timeLastAlert)))
                console.log(score);
                Const.popup = score > 350 ? "excellent" : "good";
                console.log(score)
                console.log(score > 350 ? "excellent" : "good")

                Const.score += score;
                this.alerted = false;
            } else {
                Const.score -= 100;
            }
        }.bind(this), false);

        btn.addEventListener('mouseup', function (e) {
            this.soundDown();
        }.bind(this), false);

        btn.addEventListener('pointerout', function(e) {
            this.soundDown();
        }.bind(this), false);

        btn.addEventListener('pointerenter', function (e) {
            if (!Const.keyPressed)
                return;
            this.soundUp();
        }.bind(this), false);
    }

    return new touch(btn, oscillatorType, context, view)
}