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

for ($i = 0; $i < 5; ++$i) {
    //$data = ($i . ': Hello world');
    $info = array(
        'id' => $i,
        'text' => 'Hello world ' . $i
    );
    $data = json_encode($info);

    if ($isIE) {
        echo '<script type="text/javascript">parent.callback("' . $data . '")</script>';
    } else {
        echo $data;
    }

    flush();
    ob_flush();

    sleep(1);
}

?>
