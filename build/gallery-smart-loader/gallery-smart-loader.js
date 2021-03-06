YUI.add('gallery-smart-loader', function(Y) {

var YArray = Y.Array,
    native_use = Y.use,
    comboBase = Y.Env.meta.comboBase, // default: http://yui.yahooapis.com/combo?
    comboRoot = Y.Env.meta.root, // default: [YUI VERSION]/build/
    loader = Y.Env._loader; // loader should have been loaded


Y.smartUse = function() {
    var args = Array.prototype.slice.call(arguments, 0),
    callback = args[args.length - 1];

    if (Y.Lang.isFunction(callback)) {
        args.pop();
    } else {
        callback = null;
    }
};

/**
 * get dependents for given module names
 */
Y.getDependents = function(moduleNames) {
    var allReqs = {},
    reqs, dependents = [];

    YArray.each(moduleNames, function(mName) {
        reqs = loader.getRequires(loader.getModule(mName));
        Y.mix(allReqs, YArray.hash(reqs));
    });

    dependents = Y.Object.keys(allReqs);
    return dependents;
};

/**
 * get dependents module info for given module names
 */
Y.getDependentInfos = function(moduleNames) {
    var dependents = Y.getDependents(moduleNames),
    moduleInfos = {};

    YArray.each(dependents, function(val) {
        moduleInfos[val] = loader.getModule(val);
    });

    return moduleInfos;
};

Y.getLoadUrls = function(moduleNames) {
    var modInfos = Y.getDependentInfos(moduleNames),
    urls = [],
    comboPathes = [];

    Y.Array.each(moduleNames, function(m) {
        modInfos[m] = loader.getModule(m);
        if (!modInfos[m]) {
            throw new Error('undefined module ' + m);
        }
    });

    Y.Object.each(modInfos, function(info, name) {
        if (info.path) {
            comboPathes.push(comboRoot + info.path);
        } else {
            urls.push(info.fullpath);
        }
    });

    var comboUrl = comboBase + comboPathes.join('&');

    urls.unshift(comboUrl);


    return urls;
};

Y.fetch = function(moduleNames, callback) {
    var urls,
        pendingMods = [],
        pendingCnt;

    Y.Array.each(moduleNames, function(mod) {
        if (!YUI.Env.mods[mod]) {
            pendingMods.push(mod);
        }
    });


    pendingCnt = pendingMods.length;
    if (!pendingCnt) {
        native_use.call(Y, callback);
    } else {
        urls = Y.getLoadUrls(pendingMods);

        Y.Array.each(urls, function(url) {
            Y.Get.script(url, {
                onEnd: function() {
                    --pendingCnt;

                    if (!pendingCnt) {
                        native_use.call(Y, callback);
                    }
                }
            });
        });
    }
};


}, '@VERSION@' );
