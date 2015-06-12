(function (global) {
    'use strict';

    function GeometryTools() {
        this.container = document.getElementById('geometry-tools');

        this.newBtn = document.getElementById('new-btn');
        this.newBtn.onclick = emitNewButtonClicked;
    }
    GeometryTools.prototype = new EventEmitter();
    GeometryTools.constructor = GeometryTools;

    function emitNewButtonClicked() {
        global.geometryTools.emitEvent('tools:newClicked');
    }

    global.geometryTools = new GeometryTools();
}(window.control ? window.control: window.control = {}));
