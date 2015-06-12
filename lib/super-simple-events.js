var EventEmitter = (function () {
    "use strict";

    /**
     * Constructor
     */
    function eventEmitter() {
        /**
         * Registered events and their callbacks
         * @type {Object}
         */
        this.events = {};
    }

    /**
     * Registers a callback function to a given event.
     * @param  {String} ev The event identifier.
     * @param  {Function} callback The callback function.
     */
    function registerListener(ev, callback) {
        if (!this.events[ev]) {this.events[ev] = []; }
        this.events[ev].push(callback);
    }

    /**
     * Emits an event by calling all registered callback functions
     * @param  {String} ev The event identifier
     * @param  {Object} eventObj An optional object giving information on the state of the event
     */
    function emitEvent(ev, eventObj) {
        if (this.events[ev]) {
            for (var i = 0, len = this.events[ev].length; i < len; i++) {
                this.events[ev][i](eventObj);
            }
        }
    }

    /**
     * Removes an listener from an event
     * @param  {String} ev The event identifier
     * @param  {Object} eventObj The callback function to be removed
     */
    function removeListener(ev, callback) {
        if (this.events[ev]) {
            var index = this.events[ev].indexOf(callback);
            if (index !== -1) {
                this.events[ev].splice(index, 1);
            }
        }
    }

    eventEmitter.prototype.registerListener = registerListener;
    eventEmitter.prototype.emitEvent = emitEvent;
    eventEmitter.prototype.removeListener = removeListener;

    return eventEmitter;
}());
