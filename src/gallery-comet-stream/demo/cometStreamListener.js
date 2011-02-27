var PADDING_LEN = 1024,

    url     = require('url'),
    events  = require('events'),
    util    = require('util');


//
// util functions
//
function bind(func, obj) {
    return function() {
        func.apply(obj, arguments);
    }
}

function repeatStr(str, num) {
    return isNaN(num) ? str: new Array(num+1).join(str);
}

//
// class Client
//
function Client(req, res, comet) {
    process.EventEmitter.call(this);

    this.id = Math.random().toString().substr(2);

    this.xhrStreaming = !req.headers['user-agent'].match(/MSIE/);

    if (!this.xhrStreaming) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.write(repeatStr('#', PADDING_LEN)); // push 1K padding to start IE progressive rendering
    } else {
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream'
        });
    }

    req.connection.on('end', bind(this._onEnd, this));

    this.request = req;
    this.response = res;
    this.comet = comet;
}

util.inherits(Client, process.EventEmitter);

Client.prototype._onEnd = function() {
    util.log('net stream end');

    this.emit('close', this.id);
};

Client.prototype.push = function(msg) {
    var chunk;
    msg = msg.toString();
    //util.log(util.inspect(msg));
    if (this.xhrStreaming) {
        var len = msg.length.toString(16);
        chunk = len + "\r\n" + msg + "\r\n";
    } else {
        chunk = '<script type="text/javascript">parent.push("' + msg + ')</script>';
    }
    this.response.write(chunk);
    util.log('pushed : ' + chunk);
};

//
// class CometStream
//
function CometStream(server, options) {
    var that;

    process.EventEmitter.call(this);

    // any merge function?
    this.options = {
        path: '/'
    };
    for (var i in options) {
        this.options[i] = options[i];
    }

    this._clients = {};

    server.on('request', bind(this._check, this));
};

util.inherits(CometStream, process.EventEmitter);

CometStream.prototype._removeClient= function(clientId) {
    var client = this._clients[clientId];

    this.emit('disconnection', client);

    if (client) {
        client.removeAllListeners();
        client.response.end();

        delete this._clients[clientId];
    }
}
CometStream.prototype._check = function(req, res) {

    //util.log('comet request? ' + url.parse(req.url).pathname);
    //util.log('option path? ' + this.options.path);

    if (this.options.path === url.parse(req.url).pathname) {
        this._onConnection(req, res);
    }

}

CometStream.prototype.broadcast = function(msg) {
    //util.log(util.inspect(this._clients));
    var cnt = 0;
    for(var k in this._clients) {
        this._clients[k].push(msg);
        ++cnt;
    }
    util.log('broad cast to clients #:' + cnt);
}

CometStream.prototype._onConnection = function(req, res) {
    util.log('enter CometStream::_onConnection');

    var client = new Client(req, res, this);
    this._clients[client.id] = client; 
    //util.log(util.inspect(this._clients));
    //
    client.on('close', bind(this._removeClient, this));

    this.emit('connection', client);
}

//
// exports
//
exports.listen = function(server, options) {
    return new CometStream(server, options);
};


