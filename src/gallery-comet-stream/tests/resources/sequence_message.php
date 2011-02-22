<?php

$isIE = (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== FALSE);

if ($isIE) {
    header('Content-Type: text/html');

    // necessary, since IE will buffer 256 bytes before rendering
    echo str_repeat('#', 256);
}
else {
    header('Content-Type: application/json');
}
header("Cache-control: no-cache");

$last_event_id = $_GET['last_event_id'];
$last_event_id = $last_event_id ? (int)$last_event_id : 0;

for ($i = 0; $i < 3; ++$i) {
    ++ $last_event_id;
    $words = strVal($last_event_id);

    if ($isIE) {
        echo '<script type="text/javascript">parent.push("' . $words. '")</script>';
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
