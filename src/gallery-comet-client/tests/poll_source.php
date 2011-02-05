<?php

header('Content-Type: application/json');
header("Cache-control: no-cache");

sleep(1);

$msg_id = $_COOKIE['msg_id'];

if ($msg_id) {
    setcookie('msg_id', $msg_id + 1);
} else {
    setcookie('msg_id', 1);
}

echo $msg_id . " Hello world";

?>
