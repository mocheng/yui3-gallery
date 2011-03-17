var YArray = Y.Array,
    native_use = Y.use,
    comboBase = Y.Env.meta.comboBase, // default: http://yui.yahooapis.com/combo?
    comboRoot = Y.Env.meta.root, // default: [YUI VERSION]/build/
    loader = Y.Env._loader; // loader should have been loaded

//Y.log('comboBase:' + comboBase);
//Y.log('comboRoot:' + comboRoot);

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
        reqs,
        dependents = [];

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

    Y.log('dependents:' + dependents);

    YArray.each(dependents, function(val) {
        moduleInfos[val] = loader.getModule(val);
    });

    //Y.log(moduleInfos);
    return moduleInfos;
};

Y.getLoadUrls = function(moduleNames) {
    var modInfos = Y.getDependentInfos(moduleNames),
        urls = [],
        comboPathes = [],
        comboUrl;

    Y.log(moduleNames);
    Y.log(modInfos);

    // add modules themselves
    Y.Array.each(moduleNames, function(modName) {
        // only load modules that have not been loaded.
        if (YUI.Env.mods[modName]) {
            modInfos[modName] = loader.getModule(modName);

            if (!modInfos[modName]) {
                throw new Error('undefined module ' + modName);
            }
        }
    });

    Y.Object.each(modInfos, function(info, modName) {
        //Y.log(modName);

        if (info.path) {
            comboPathes.push(comboRoot + info.path);
        } else {
            urls.push(info.fullpath);
        }
    });

    //TODO: perhaps we need more than one combo
    if (comboPathes.length) {
        comboUrl = comboBase + comboPathes.join('&');
        urls.unshift(comboUrl);
    }

    Y.log(urls);

    return urls;
};

Y.fetch = function(moduleNames, callback) {
    var urls,
        pendingMods = [],
        pendingCnt;

    function _finish() {
    }

    Y.Array.each(moduleNames, function(mod) {
        if (!YUI.Env.mods[mod]) {
            pendingMods.push(mod);
        }
    });

    Y.log('pendingMods length:' + pendingMods.length);

    pendingCnt = pendingMods.length;
    if (!pendingCnt) {
        native_use.call(Y, callback);
    } else {
        Y.log('pendingMods: ' + pendingMods);
        urls = Y.getLoadUrls(pendingMods);

        Y.log(urls);

        Y.Array.each(urls, function(url) {
            //Y.log(url);
            Y.Get.script(url, {
                onSuccess: function() {
                    Y.log('onSuccess');
                    -- pendingCnt;

                    if (!pendingCnt) {
                        native_use.call(Y, callback);
                    }
                },
                onFailure: function() {
                    Y.log('onFailure');
                    _finish();
                },
                onTimeout: function() {
                    Y.log('onTimeout');
                    _finish();
                }
            });
        });
    }

};
