/**
 *
 * @module gallery-comet-client
 */

/**
 * readyState possible value.
 * http://www.quirksmode.org/blog/archives/2005/09/xmlhttp_notes_r_2.html
 */
var READY_STATE = {

    UNINITIALIZED: 0,  // open() has not been called yet.

    LOADING: 1,  // send() has not been called yet.

    LOADED: 2,  // send() has been called, headers and status are available.

    INTERACTIVE: 3,  // Downloading, responseText holds the partial data.

    COMPLETED: 4 // Finished with all operations.
};

function CometClient(url, cfg) {
    Y.Event.Target.call(this);

    this.url = url;

    this.cfg = Y.merge({
        on: {}, // on events
        resetTimeout: 300 * 1000, // in server-stream mode, the connection is reset every given seconds to avoid memory leak
        retryOnDisconnect: true, // whether to retry on HTTP dis-connected
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

            xhr.onreadystatechange = function() {
                that._onXhrStreamStateChange();
            };
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

    _pollResponse: function() {
        this._parseResponse(this.xhr.responseText);
    },

    _onXhrStreamStateChange: function() {
        var xhr = this.xhr,
            status;
        if (!xhr) {
            return;
        }

        //TODO: handle situation: server end response, server no response.

        try {
            status = xhr.status;
        } catch (e) {
            //Opera throw exception if we check xhr.status when readyState < INTERACTIVE
        }

        if (status === 200) {
            if (xhr.readyState === READY_STATE.INTERACTIVE) {
                // For Opera, it doesn't trigger INTERACTIVE ready state for each pushed data. So, we have to do polling.
                //
                if (Y.UA.opera) {
                    this._pollHandler = Y.later(this.cfg.xhrPollingInterval, this, this._pollResponse, null, true);
                } else {
                    this._parseResponse(xhr.responseText);
                }
            } else if (xhr.readyState === READY_STATE.COMPLETED) {
                if (Y.UA.opera) {
                    // poll it for the last time in case something is missing.
                    this._pollResponse();
                }

                if (this.cfg.retryOnDisconnect) {
                    this._endStream();
                    this._initStream();
                }
            }
        }
    },

    _parseResponse: function(responseText) {
        // Browser doesn't expose chunked structure to us. So, we have to build chunked data based on HTTP trunked data.
        //
        while (true) {
            var msg, msgStartPos, msgEndPos,
                sizeStartPos, sizeEndPos, sizeLine, size;

            sizeStartPos = this._lastMsgIdx;
            sizeEndPos = responseText.indexOf('\r\n', sizeStartPos);
            if (sizeEndPos == -1) {
                break;
            }
            sizeLine = responseText.substring(sizeStartPos, sizeEndPos);
            size = Number('0x' + Y.Lang.trim(sizeLine));

            if (window.isNaN(size)) {
                Y.log('wrong format');
                //TODO: reconnect?
                this._endStream();
                throw new Error('wrong fomat');
            }

            msgStartPos = sizeEndPos + 2; //pass '\r\n'
            msgEndPos = msgStartPos + size;

            if (msgEndPos > responseText.length) {
                // this chunk doesn't get completed yet.
                break;
            }

            this._lastMsgIdx = msgEndPos + 2; // pass '\r\n'
            msg = responseText.substr(msgStartPos, size);

            this._fireMessageEvent(msg);
        }

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
            // NOTE: Actually, we cannot implement comet with IE XHR since it doesn't trigger readyState===INTERACTIVE state in progress.
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
