var PORT = 8080,

    http = require('http'),
    util = require('util'),
    url  = require('url'),
    path = require('path'),
    fs   = require('fs'),

    cometStream = require('./cometStreamListener');

// check memory usage in case for memory leak
/*
setInterval(function() {
    util.log(util.inspect(process.memoryUsage(), true));
}, 5000);
*/

var server = http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), pathname);

    path.exists(filename, function(exists) {
        if (!exists) {
            return;
        }

        fs.readFile(filename, "binary", function(err, file) {
            if (err) {
                res.writeHead(500, {"Content-Type": "text/html"});
                res.write(err + '');
                res.end();
                return;
            }

            res.writeHead(200);
            res.write(file, "binary");
            res.end();
        });
    });

});

server.listen(PORT);

/*
server.on('request', function(req, res) {
    util.log('request url:' + req.url);

    req.on('end', function() {
        util.log('request end:' + req.url);
    });
});
*/

//
// For stock value case
//
var stockValue = 16.5;

var stockValueComet = cometStream.listen(server, {
    path: '/subscribe'
});

stockValueComet.on('connection', function(client) {
    util.log('got one comet connection');

    client.push(stockValue);
});

server.on('request', function(req, res) {
    var urlParams = url.parse(req.url, true);
    var pathname = urlParams.pathname;

    if (pathname === '/publish') {
        res.writeHead(200);
        res.end()

        var newVal = urlParams.query ? urlParams.query.val: -1;
        if (newVal >= 0) {
            util.log('new stock value:' + newVal);
            stockValue = newVal;
            stockValueComet.broadcast(newVal.toString());
        }
    }
});

//
// For chat room case
//
var history = [];

var chatRoomComet = cometStream.listen(server, {
    path: '/chat/subscribe'
});

chatRoomComet.on('connection', function(client) {
    util.log('got one comet connection');

    //client.push('first msg');
    //TODO: push last 20 messages
});

server.on('request', function(req, res) {
    var urlParams = url.parse(req.url, true);
    var pathname = urlParams.pathname;

    if (pathname === '/chat/send') {
        util.log('got post msg');
        res.writeHead(200);
        res.end()

        var postData = '';
        req.on('data', function(chunk) {
            util.log('data event');
            postData += chunk;
        });
        req.on('end', function() {
            util.log('got post msg: ' + postData);
            chatRoomComet.broadcast(postData);
        });
    }
});


util.log('Server running on port ' + PORT);
