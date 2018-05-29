function touch(keyCode, frequency, oscillatorType, context){
    this.keyCode = keyCode;
    this.frequency = frequency;
    this.oscillatorType

    this.context = context;

    this.oscillator;
    this.gain;


    this.soundUp = function() {
        this.oscillator.start();
    }

    this.soundDown = function() {
        this.gain.gain.exponentialRampToValueAtTime(
            0.00001, context.currentTime + 0.04
        );
        this.setupSound();
    }

    this.setupSound = function() {
        this.oscillator = this.context.createOscillator();
        this.gain = this.context.createGain();

        this.oscillator.connect(this.gain);
        this.gain.connect(this.context.destination);

        this.oscillator.type = oscillatorType;
        this.oscillator.frequency.value = this.frequency;
    }
}