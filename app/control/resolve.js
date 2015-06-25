(function (global) {
    'use strict';

    var container = document.getElementById('resolve');

    function Resolve() {
        var forms = container.getElementsByTagName('form')

        for (var i = 0, len = forms.length; i < len; i++) {
            forms[i].addEventListener('submit', handleResolveInput);
        }
    }
    Resolve.prototype = new EventEmitter();
    Resolve.constructor = Resolve;
    global.resolve = new Resolve();

    Resolve.prototype.show = function show () {
        container.classList.add('visible');
    }

    Resolve.prototype.hide = function hide () {
        container.classList.remove('visible');
    }

    function handleResolveInput(event) {
        event.preventDefault();
        global.resolve.hide();

        if (this['resolve'].value) {
            global.resolve.emitEvent('input:' + this.id, this['resolve'].value);
        }
    }

}(window.control ? window.control: window.control = {}));
