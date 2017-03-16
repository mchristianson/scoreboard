<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
$pdo = new PDO('mysql:unix_socket=/tmp/mysql.sock;host=localhost;dbname=smdtest1_scoreboard', 'smdtest1_score', 'scoreboard1234');

?>