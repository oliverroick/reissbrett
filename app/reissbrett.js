(function (global) {
    'use strict';

    var map =     global.control.map,
        resolve = global.control.resolve,
        Message = global.control.Message;

    function Reissbrett() {
        map.registerListener('draw:conflict:selfintersect', handleSelfIntersect);
        map.registerListener('draw:conflict:intersect', handleIntersect);
        map.registerListener('draw:start', handleDrawStart);
    }

    function handleDrawStart() {
        var message = new Message('info', 'Click on the map to start drawing.');
        message.show(3000);
    }

    function handleSelfIntersect() {
        var message = new Message('warning', 'Self intersecting polygon.');
        message.show(3000);
    }

    function handleIntersect() {
        var message = new Message('error', 'The polygon intersects with another one.');
        message.show(3000);

        resolve.show();
        resolve.registerListener('input:resolve-polygon-intersect', handleResolve);
    }

    function handleResolve(eventResult) {
        map.resolveConflict(eventResult);
        resolve.removeListener('input:resolve-polygon-intersect', handleResolve);
    }

    global.app = new Reissbrett();
}(window));
