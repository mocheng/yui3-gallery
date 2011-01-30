
function CometClient(url, cfg) {
    Y.Event.Target.call(this);

    this.url = url;
    
    this.cfg = cfg;

    this._init();
}


CometClient.prototype = {
    _init: function() {
        var xhr,
            that = this;

        /**
         * Last pushed data index which is to track newly pushed data start point.
         *
         * @type int
         * @property _lastPushedIdx
         * @private 
         */
        this._lastPushedIdx = 0;

        xhr = this._createXHR();
        
        xhr.onreadystatechange = function() {
            that._onXhrStateChange(xhr);
        };
        xhr.open('GET', this.url, true);
        xhr.send();
    },

    _onXhrStateChange: function(xhr) {
        var msg;

        Y.log('readyState:' + xhr.readyState);
        if (xhr.readyState === 3) {
            //TODO: process data
            //Y.log(xhr.responseText);

            msg = xhr.responseText.substring(this.lastPushedIdx);
            this.lastPushedIdx = xhr.responseText.length;
            Y.log('pushed msg:<' + msg + '>');
            Y.log('lastPushedIdx: ' + this.lastPushedIdx);

            this.fire('comet:pushed', msg);

            if (this.cfg && this.cfg.on && this.cfg.on.pushed) {
                //TODO: it is possible that multiple messages are pushed together. There should be a way to delimit messages.
                //
                this.cfg.on.pushed(msg);
            }
        }
    },

    /**
     * create an XMLHttpRequest according to current browser.
     *
     * @method _createXHR
     * @return XMLHttpRequest XHR instance
     */
    _createXHR: function() {
        var xhrObj = null;

        // most browsers (including IE7) just use below 2 lines
        if (window.XMLHttpRequest) {
            xhrObj = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // IE5/6 falls into this block
            //
            // NOTE: Actually, we cannot implement comet with IE XHR since it doesn't trigger readyState===3 state in progress.
            // We keep below code for Long-Poll.
            try {
                xhrObj = new window.ActiveXObject('Msxml2.XMLHTTP');
            } catch (e1) {
                try {
                    xhrObj = new window.ActiveXObject('Microsoft.XMLHTTP');
                } catch (e2) {
                    xhrObj = null;
                }
            }
        }
        if (!xhrObj) {
            throw new Error('XMLHttpRequest is not supported');
        }
        return xhrObj;
    }
};

Y.extend(CometClient, Y.Event.Target, CometClient.prototype);

Y.CometClient = CometClient;
