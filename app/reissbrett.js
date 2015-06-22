(function (global) {
    'use strict';

    var map = global.control.map;

    function Reissbrett() {
        map.registerListener('draw:conflict:selfintersect', handleSelfIntersect);
        map.registerListener('draw:conflict:intersect', handleIntersect);
        map.registerListener('draw:start', handleDrawStart);
    }

    function handleDrawStart() {
        console.log('draw:start');
    }

    function handleSelfIntersect() {
        console.log('draw:conflict:selfintersect');
    }

    function handleIntersect() {
        console.log('draw:conflict:intersect');
    }

    global.app = new Reissbrett();
}(window));
