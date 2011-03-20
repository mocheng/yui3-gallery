YUI.add('gallery-unified-history', function(Y) {

//override Y.HistoryHash: parseHash & _storeState(or createHash?)
//         Y.HistoryHTML5: _storeState
//

var SRC_POPSTATE    = 'popstate',
    Do = Y.Do,

    win             = Y.config.win,
    location        = win.location,

    HistoryHash     = Y.HistoryHash,
    HistoryHTML5    = Y.HistoryHTML5,

    nativeCreateHash = HistoryHash.createHash;


function getHtml5UrlFragment(state, config) {
    if (config.useKeyValuePair) {
        return (location.href.indexOf('?') != -1 ? '&' : '?') + nativeCreateHash(state);
    } else if (config.usePath) {
        var path = [];

        Y.Array.each(config.usePath, function(val, i) {
            if (Y.Lang.isValue(state[val])) {
                path.push(state[val]);
            }
        });

        //TODO: what if url has query string or hash fragment?

        return (location.href.charAt(location.href.length-1) === '/' ? '' : '/') + path.join('/');
    }
}

/**
 *
 * Update URL according to new state.
 *
 * @method _updateUrl
 * @param {String} src Source of the changes.
 * @param {Object} newState New state to store.
 * @param {Object} options Zero or more options.
 * @protected
 */
HistoryHTML5._updateUrl = function(src, newState, options) {
    if (src !== SRC_POPSTATE) {
        options.url = location.href + getHtml5UrlFragment(newState, this._config);
    }
};

var _nativeHTML5Init = HistoryHTML5.prototype._init;

HistoryHTML5.prototype._init = function() {
    Do.before(HistoryHTML5._updateUrl, this, '_storeState', this);

    _nativeHTML5Init.apply(this, arguments);
};





}, '@VERSION@' ,{requires:['history'], skinnable:false});
