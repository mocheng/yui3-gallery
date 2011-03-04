function getLoader() {
    // loader should have been loaded
    return Y.Env._loader;
}

Y.smartUse = function() {
    var args = Array.prototype.slice.call(arguments, 0),
        callback = args[args.length - 1];

    if (Y.Lang.isFunction(callback)) {
        args.pop();
    } else {
        callback = null;
    }
};

Y.getDependent = function(modules) {
    var loader = getLoader(),
        dependents;

    console.log(modules);

    loader.require(modules);
    loader.ignoreRegistered = true;
    loader.calculate(null, 'js');
    dependents = loader.sorted;

    console.log(dependents);
    return dependents;
};
