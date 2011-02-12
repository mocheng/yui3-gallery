<?php

$isIE = (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== FALSE);

if ($isIE) {
    header('Content-Type: text/html');

    // necessary, since IE will buffer 256 bytes before rendering
    echo str_repeat('#', 2560);
}
else {
    header('Content-Type: application/json');
}
header("Cache-control: no-cache");

for ($i = 0; $i < 10; ++$i) {
    $words = ($i . ': Hello world');

    if ($isIE) {
        echo '<script type="text/javascript">parent.callback("' . $words. '")</script>';
    } else {
        $len = dechex(strlen($words));
        $data = "{$len}\r\n{$words}\r\n";

        echo $data;
    }

    ob_flush();
    flush();

    sleep(1);
}

?>
