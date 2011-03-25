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
    cursor: pointer;
    float: left;
    border: 1px solid #DADADA;
    margin-left: 10px;
    width: 80px;
    height: 40px;
    display: block;
    line-height: 40px;
    vertical-align: middle;
    cursor: pointer;
}

ul.list li:hover {
    color: #AAA;
}

ul.list li.selected{
    color: #BBB;
}


li.selected {
    background-color: #777;
}
        </style>
    </head>
    <body class="yui3-skin-sam">
<?php
    $requestUri = $_SERVER['REQUEST_URI'];
    $selfUri = $_SERVER['PHP_SELF'];
    $selfDirName = dirname($selfUri);

    $paramsStr = substr($requestUri, strlen($selfDirName)+1);

    if (!$paramsStr) {
        $params = array(
            'page' => 'home',
            'display' => 'list'
        );
    } else {
        if (substr($paramsStr, 0, 1) == '?') {
            parse_str(substr($paramsStr, 1), $params);
        } else {
            $arr = split('/', $paramsStr);
            $params = array(
                'page' => $arr[0],
                'display' => $arr[1]
            );
        }
        $params['display' ] = $params['display'] ? $params['display'] : 'list';
    }

    if (!$params['page'] || !$params['display']) {
        header("HTTP/1.0 404 Not Found");
        echo 'Page not found';
        return;
    }

    $jsonFile = './' . $params['page'] . '.json';
    if (!file_exists($jsonFile)) {
        header("HTTP/1.0 404 Not Found");
        echo 'Resource not found';
        return;
    }

?>
        <div id="demo">
            <ul id="nav-list" class="list">

                <li class="<?php echo $params['page'] == 'home' ? 'selected' : '' ?>"><a href="home">Home</a></li>
                <li class="<?php echo $params['page'] == 'articles' ? 'selected' : '' ?>"><a href="articles">Articles</a></li>
                <li class="<?php echo $params['page'] == 'about' ? 'selected' : '' ?>"><a href="about">About</a></li>
            </ul>
            <p>
<?php
    $fileContent = file_get_contents($jsonFile);
    $data = json_decode($fileContent);
    echo $data->content;
?>
            </p>
        </div>
        <div id="console">
        </div>

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
    }, '#nav-list', 'li');


var history = new Y.History({
    usePath: ['tab', 'pic']
});
/*
history.addValue('tab', 2, {
    title: 'hello'
});
*/
/*
history.add({
    'tab' : 1,
    'pic' : 'abc'
});
 */


});
        </script>
    </body>
</html>
