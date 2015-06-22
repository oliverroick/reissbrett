(function (global) {
    'use strict';

    var container;

    function Message() {
        container = document.getElementById('message-popup');
    }
    global.message = new Message();

    function show (type, text, autohide) {
        clearClasses();
        container.classList.add('visible');
        container.classList.add(type);
        container.innerHTML = text;

        if (autohide) {
            setTimeout(function () {
                hide();
            }, autohide);
        }
    }
    Message.prototype.show = show;

    function hide (type, text) {
        clearClasses();
        container.innerHTML = '';
    }
    Message.prototype.hide = hide;

    function clearClasses() {
        for (var i = 0, len = container.classList.length; i < len; i++) {
            container.classList.remove(container.classList[i]);
        }
    }

}(window.control ? window.control: window.control = {}));
