<!DOCTYPE HTML>
<html>
    <head>
        <meta name="viewport" content="width=device-width,user-scalable=no">

        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>Test</title>
        <!--for local dev without WIFI -->
        <script type="text/javascript" src="http://localhost/3.3.0/build/yui/yui-min.js"></script>

        <!-- <script type="text/javascript" src="http://yui.yahooapis.com/combo?3.3.0/build/yui/yui-min.js"></script> -->
        <script type="text/javascript" src="/yui3-gallery/src/gallery-unified-history/build_tmp/gallery-unified-history-debug.js"></script>

        <style type="text/css" media="screen">
#demo{
    width: 640px;
    margin: 10px auto;
}

ul.list {
    display: block;
    list-style-type: none;
    height: 50px;
    text-align: center;
}

ul.list li {
    float: left;
    border: 1px solid #DADADA;
    width: 80px;
    height: 40px;
    display: block;
    line-height: 40px;
    vertical-align: middle;
    cursor: pointer;
}

li.selected {
    background-color: #777;
}
        </style>
    </head>
    <body class="yui3-skin-sam">
        <div id="demo">
            <h1 id="info">The page should not refresh</h1>
            <h1 id="info"><?php echo $_SERVER['REQUEST_URI']; ?></h1>
            <h1 id="info"><?php echo $_SERVER['PHP_SELF']; ?></h1>
            <p>
<?php
//echo file_get_contents('./test.json');
?>
            </p>
            <ul id="color-list" class="list">
                <li>Red</li>
                <li>Green</li>
                <li>Blue</li>
            </ul>
            <ul id="size-list" class="list">
                <li>10</li>
                <li>20</li>
                <li>30</li>
            </ul>
        </div>
        <div id="console"></div>

        <script type="text/javascript" charset="utf-8">
YUI({
    //filter: 'raw',
    //combine: false
}).use('gallery-unified-history', 'history', 'node', function(Y) {
    var info = Y.one("#info");

    function updateColor(color) {
        info.setStyle('color', color);
    }

    function updateFontSize(fontSize) {
        info.setStyle('fontSize', fontSize + 'px');
    }

    Y.delegate('click', function(ev) {
        updateColor(ev.target.get('innerHTML'));
    }, '#color-list', 'li');

    Y.delegate('click', function(ev) {
        updateFontSize(ev.target.get('innerHTML'));
    }, '#size-list', 'li');


var history = new Y.History({
    usePath: ['tab', 'pic']
});
/*
history.addValue('tab', 2, {
    title: 'hello'
});
*/
history.add({
    'tab' : 1,
    'pic' : 'abc'
});


});
        </script>
    </body>
</html>
