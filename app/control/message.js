(function (global) {
    'use strict';

    function Message(type, text) {
        this.container = document.createElement('section');

        this.container.classList.add('message');
        this.container.classList.add(type);
        this.container.innerHTML = text;

        document.getElementsByTagName('body')[0].appendChild(this.container);
    }
    global.Message = Message;

    Message.prototype.show = function show (autohide) {
        setTimeout(function () { // 20ms lag before element is created
            this.container.classList.add('visible');
        }.bind(this), 20);

        if (autohide) {
            setTimeout(function () {this.hide();}.bind(this), autohide);
        }
    };

    Message.prototype.hide = function hide (type, text) {
        this.container.classList.remove('visible');

        setTimeout(function () { // wait 400ms for transition to finish
            this.container.parentNode.removeChild(this.container);
        }.bind(this), 400);
    };

}(window.control ? window.control: window.control = {}));
