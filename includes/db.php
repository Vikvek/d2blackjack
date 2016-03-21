<?php
//MySQLi procedural
$servername = "localhost";
$username = "d2blackjack_db";
$password = "db_connect";
$dbname = "d2blackjack_database";

// Create connection
$db = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
//if (!$db) {
//    die("Connection failed: " . mysqli_connect_error());
//}

?>