/**
 *
 * @module gallery-comet-client
 */

function CometClient(url, cfg) {
    Y.Event.Target.call(this);

    this.url = url;

    this.cfg = Y.merge({
        on: {}, // on events
        resetTimeout: 300 * 1000, // in server-stream mode, the connection is reset every given seconds to avoid memory leak
        xhrPollingInterval: 50 // xhr polling internal for Opera
    }, cfg);

    this._initStream();
}

CometClient.prototype = {
    _initStream: function() {
        var xhr,
            that = this;

        /**
         * Last pushed data index which is to track newly pushed data start point.
         *
         * @type int
         * @property _lastMsgIdx
         * @private 
         */
        this._lastMsgIdx = 0;

        if (Y.UA.ie) {
            this._createIFrame(this.url, function(data) { 
                if (that.cfg.on.pushed) {
                    that.cfg.on.pushed(data);
                }
            });

        } else {
            xhr = this.xhr = this._createXHR();

            // For Opera, it doesn't trigger INTERACTIVE ready state for each pushed data. So, we have to do polling.
            //
            if (Y.UA.opera) {
                this._pollHandler = Y.later(this.cfg.xhrPollingInterval, this, this._pollResponse, [xhr], true);
            } else {
                xhr.onreadystatechange = function() {
                    that._onXhrStreamStateChange(xhr);
                };
            }
            xhr.open('GET', this.url, true);
            xhr.send();

        }

        this._streamStartTime = new Date();
    },

    _endStream: function() {
        if (this.transDoc) {
            this.transDoc = null; // Let it be GC-ed
        }

        if (this._pollHandler) {
            this._pollHandler.cancel();
        }

        if (this.xhr) {
            var xhr = this.xhr;
            this.xhr = null;
            xhr.onreadystatechange = null;
            xhr.abort();
        }
    },

    _pollResponse: function(xhr) {
        this._parseResponse(xhr.responseText);
    },

    _onXhrStreamStateChange: function(xhr) {
        Y.log('readyState:' + xhr.readyState);

        //TODO: handle server end response, server no response.

        if (xhr.status === 200) {
            if ((xhr.readyState === 3) && !Y.UA.opera) {
                this._parseResponse(xhr.responseText);
            } else if (xhr.readyState === 4) {
                this._initStream();
            }
        }
    },

    _parseResponse: function(response) {
        while (true) {
            var dataLen, msg,
                data = response.substring(this._lastMsgIdx),
                match = data.match(/^Content-Length:\s*(\d*)\s*\n/);
            if (!match) {
                // no match, keep waiting!
                break;
            }
            dataLen = match[1] * 1;
            this._lastMsgIdx = this._lastMsgIdx + match[0].length + dataLen + 1;
            msg = data.substr(match[0].length, dataLen);

            Y.log('pushed msg:<' + msg + '>');
            Y.log('_lastMsgIdx: ' + this._lastMsgIdx);

            this._fireMessageEvent(msg);
        }

        Y.log('timeout:' + this.cfg.resetTimeout);
        if ((new Date()).getTime() - this._streamStartTime.getTime() >= this.cfg.resetTimeout) {
            this._endStream();
            this._initStream();
        }
    },

    _fireMessageEvent: function(msg) {
        this.fire('comet:pushed', msg);

        if (this.cfg.on.pushed) {
            this.cfg.on.pushed(msg);
        }
    },

    _createIFrame: function(url, callback) {
        // Don't let transDoc be GC-ed.
        this.transDoc = new window.ActiveXObject('htmlfile');
        this.transDoc.open();

        // Don't assign domain if same. It will break in IE8.
        //
        if (url.match(/^http.?:\/\/([^\/]+)\/?/)[1] !== window.document.domain) {
            this.transDoc.write('<html><script type="text/javascript">document.domain="' + window.document.domain + '";</script></html>');
        }
        this.transDoc.write('<html></html>');
        this.transDoc.close();

        this.transDoc.parentWindow.callback = callback;
        this.transDoc.parentWindow.mo = 'mo';

        var iframeDiv = this.transDoc.createElement('div');
        this.transDoc.body.appendChild(iframeDiv);
        iframeDiv.innerHTML = '<iframe src="' + url + '"></iframe>';
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
            // I keep below code for Long-Poll(perhaps in the future)
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
