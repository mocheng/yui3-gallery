var YEvent = Y.Event;


function _checkBeacon(ev, subscription, notifier) {
    var node = this;

    //Y.log(this);
    Y.log(ev);
    //Y.log(subscription);
    //Y.log(notifier);

    Y.log('_checkBeacon');
    if (!subscription._eventTriggered) {
        subscription._eventTriggered = true;

        //ev.type = "beacon-reached";
        Y.later(1, this, function() {
            if (Y.DOM.inViewportRegion(Y.Node.getDOMNode(this), false)) {
                notifier.fire(ev);
            }
            subscription._eventTriggered = false;
        });
    }
}

YEvent.define('beacon-reached', {

    on: function(node, subscription, notifier) {
        subscription._onScrollHandle = Y.on('scroll', _checkBeacon, window, node, subscription, notifier);
        subscription._onResizeHandle = Y.on('resize', _checkBeacon, window, node, subscription, notifier);
    },

    detach: function(node, subscription, notifier) {
        if (subscription._onScrollHandle) {
            subscription._onScrollHandle.detach();
        }
        if (subscription._onResizeHandle) {
            subscription._onResizeHandle.detach();
        }
    }

    // To support delegate, it would check multiple elements inVeiwport for every scroll event.
    // It seems not-good idea to have delegate for this event.
    /*
    delegate: function(node, subscription, notifier, filter) {
    },

    detachDelegate: function(node, subscription, notifier, filter) {
        if (subscription._delegateHandle) {
            subscription._delegateHandle.detach();
        }
    }
    */
});
