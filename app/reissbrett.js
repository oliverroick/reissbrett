(function (global) {
    'use strict';

    var geometryTools = global.control.geometryTools,
        map =           global.control.map;

    function Reissbrett() {
        geometryTools.registerListener('tools:newClicked', map.activateDraw);
    }

    global.app = new Reissbrett();
}(window));
