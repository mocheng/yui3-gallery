/**
 * Provides synthetic event to detect beacon element turns into browser viewport.
 *
 * @module scroll-beacon
 */

/**
 * Configurable throttling delay value in milliseconds.
 *
 * @config Y.config.ScrollBeacon.throttleDelay
 * @type {Number}
 */

var throttleDelay = (Y.config.ScrollBeacon && Y.config.ScrollBeacon.throttleDelay) || 50,
    EVENT_TYPE = 'beacon:reached';

/**
 * Provides a subscribable event named &quot;beacon:reached&quot;.
 *
 * @event beacon:reached
 * @param type {String} 'beacon:reached'
 * @param fn {Function} the callback function
 * @param id {String|Node|etc} the element to bind (typically document)
 * @param o {Object} optional context object
 * @param args 0..n additional arguments that should be provided 
 * to the listener.
 * @return {Event.Handle} the detach handle
 */

Y.Event.define(EVENT_TYPE, {

    _attach: function(node, subscription, notifier, filter) {
        var method = filter ? 'delegate' : 'on';

        if (filter) {
            method = 'delegate';
            if (!Y.Lang.isString(filter)) {
                throw new Error('filter function is not supported');
            }
            subscription._nodeList = node.all(filter);
        } else {
            method = 'on';
            subscription._nodeList = new Y.NodeList(node);
        }

        // Both scroll or resize can turn on element into viewport.
        //
        subscription['_' + method + 'ScrollHandle'] = Y.on('scroll', this._checkBeacon, window, node, subscription, notifier, filter);
        subscription['_' + method + 'ResizeHandle'] = Y.on('resize', this._checkBeacon, window, node, subscription, notifier, filter);
    },

    _checkBeacon: function(ev, subscription, notifier, filter) {
        // Depending on browser, the scroll event might be fired a lot. It is not good idea
        // to trigger event handler for every scroll event. Instead, only trigger it after 
        // some delay to throttle it.
        //
        if (!subscription._throttled) {
            subscription._throttled = true;

            Y.later(throttleDelay, this, function() {
                subscription._nodeList.each(function(node, i) {
                    if (Y.DOM.inViewportRegion(Y.Node.getDOMNode(node), false)) {
                        ev.type = EVENT_TYPE;
                        notifier.fire(ev);
                    }
                });
                subscription._throttled = false;
            });
        }
    },

    _detach: function(subscription, method) {
        var onScrollHandle = subscription['_' + method + 'ScrollHandle'],
            onResizeHandle = subscription['_' + method + 'ResizeHandle'];

        if (onScrollHandle) {
            onScrollHandle.detach();
        }
        if (onResizeHandle) {
            onResizeHandle.detach();
        }
    },

    on: function(node, subscription, notifier) {
        this._attach.apply(this, arguments);
    },

    detach: function(node, subscription) {
        this._detach(subscription, 'on');
    },

    delegate: function(node, subscription, notifier, filter) {
        this._attach.apply(this, arguments);
    },

    detachDelegate: function(node, subscription) {
        this._detach(subscription, 'delegate');
    }
});
