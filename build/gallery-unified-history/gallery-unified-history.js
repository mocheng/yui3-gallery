YUI.add('gallery-unified-history', function(Y) {


var SRC_POPSTATE    = 'popstate',
    Do = Y.Do,
    Lang = Y.Lang,

    win             = Y.config.win,
    location        = win.location,

    HistoryHash     = Y.HistoryHash,
    HistoryHTML5    = Y.HistoryHTML5,

    _nativeHTML5Init = HistoryHTML5._init,
    _nativeHashInit = HistoryHash._init,
    nativeParseHash = HistoryHash.parsetHash,
    nativeCreateHash = HistoryHash.createHash;

//////////////////////////////////
// HistoryHTML5 part
//////////////////////////////////

function getHtml5UrlFragment(state, config) {
    if (config.useKeyValuePair) {
        return (location.href.indexOf('?') != -1 ? '&' : '?') + nativeCreateHash(state);
    } else if (Y.config.usePath) {

        //TODO: what if url has query string or hash fragment?

        return (location.href.charAt(location.href.length-1) === '/' ? '' : '/') + HistoryHash.createHash(state);
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

HistoryHTML5.prototype._init = function() {
    Do.before(HistoryHTML5._updateUrl, this, '_storeState', this);

    _nativeHTML5Init.apply(this, arguments);
};


//////////////////////////////////
// HistoryHash part
//////////////////////////////////

HistoryHash.prototype._init = function(config) {
    // The config.usePath is supposed to be used in parseHash & createHash, but parsehash &
    // createHash are static methods which cannnot access config specfici to one HistoryHash
    // instance. Since one page has obviously need only one History instance, we copy related
    // config to Y.config to be available for static methods parseHash & createHash.
    //
    if (config.usePath) {
        Y.config.usePath = config.usePath;
    }

    _nativeHashInit.apply(this, arguments);
};

/**
 * Replaces native method HistoryHash.parseHash of YUI.
 *
 * Parses a location hash string into an object of key/value parameter
 * pairs. If <i>hash</i> is not specified, the current location hash will
 * be used.
 *
 * @method parseHash
 * @param {String} hash (optional) location hash string
 * @return {Object} object of parsed key/value parameter pairs
 * @static
 */
HistoryHash.parseHash = function (hash) {
    if (!Y.config.usePath) {
        nativeParseHash.apply(this, arguments);
        return;
    }

    var decode = HistoryHash.decode,
        i,
        len,
        segments,
        param,
        params = {},
        prefix = HistoryHash.hashPrefix,
        prefixIndex;

    hash = Lang.isValue(hash) ? hash : HistoryHash.getHash();

    if (prefix) {
        prefixIndex = hash.indexOf(prefix);

        if (prefixIndex === 0 || (prefixIndex === 1 && hash.charAt(0) === '#')) {
            hash = hash.replace(prefix, '');
        }
    }

    segments = hash.split('/');
    for (i = 0, len = segments.length; i < len; ++i) {
        params[decode(Y.config.usePath[i])] = decode(segments[i]);
    }

    return params;
};

/**
 * Replaces native method HistoryHash.parseHash of YUI.
 *
 * Creates a location hash string from the specified object of key/value
 * pairs. The hash string is composed according to config.
 *
 * @method createHash
 * @param {Object} params object of key/value parameter pairs
 * @return {String} location hash string
 * @static
 */
HistoryHash.createHash = function (params) {
    if (!Y.config.usePath) {
        nativeCreateHash.apply(this, arguments);
        return;
    }

    var encode      = HistoryHash.encode,
        segments    = [];

    Y.Array.each(Y.config.usePath, function(val, i) {
        if (Lang.isValue(params[val])) {
            segments.push(params[val]);
        }
    });

    return segments.join('/');
};



}, '@VERSION@' ,{skinnable:false, requires:['history']});
