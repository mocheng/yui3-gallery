var YArray = Y.Array,
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

    YArray.each(dependents, function(val) {
        moduleInfos[val] = loader.getModule(val);
    });

    //Y.log(moduleInfos);
    return moduleInfos;
};

