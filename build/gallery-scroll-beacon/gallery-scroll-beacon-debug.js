YUI.add('gallery-scroll-beacon', function(Y) {

var YEvent = Y.Event;

YEvent.define('beacon-reached', {

    on: function(node, subscription, notifier) {
    },

    detach: function(node, subscription, notifier) {
    },

    delegate: function(node, subscription, notifier, filter) {
    },

    detachDelegate: function(node, subscription, notifier, filter) {
    }

});



}, '@VERSION@' ,{skinnable:false, requires:['event-custom']});
