var _keyPressed = false;
var _score = 0;

var timeout;

var _scoreView;
var _popupView;

class Const {

    static set keyPressed(val) {
        _keyPressed = val;
    }
    static get keyPressed() {
        return _keyPressed;
    }

    static set score(val) {
        if (val == _score){
            console.log('yo');
            return;
        }
        _score = val;

        if (_score <= 0) 
            _scoreView.innerText = 'fucking noob !';
        else 
            _scoreView.innerText = _score;
    }
    static get score() {
        return _score;
    }

    static set popup(val){
        clearTimeout(timeout);
        _popupView.innerText = val;
        timeout = setTimeout(function () { _popupView.innerText = '' }, 750);
    }

    static set scoreView (val){
        _scoreView = val;
        _scoreView.innerText = _score;
    }
    static set popupView(val) {
        _popupView = val;
    }
}