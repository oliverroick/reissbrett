(function (global) {
    'use strict';

    var map =     global.control.map,
        message = global.control.message;

    function Reissbrett() {
        map.registerListener('draw:conflict:selfintersect', handleSelfIntersect);
        map.registerListener('draw:conflict:intersect', handleIntersect);
        map.registerListener('draw:start', handleDrawStart);
    }

    function handleDrawStart() {
        message.show('info', 'Click on the map to start drawing.', 3000);
    }

    function handleSelfIntersect() {
        message.show('warning', 'Self intersecting polygon.', 3000);
    }

    function handleIntersect() {
        message.show('error', 'The polygon intersects with another one.', 3000);
    }

    global.app = new Reissbrett();
}(window));
