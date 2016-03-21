<?php
//Logout page redirect
include("settings.php");
header("Location: ../".$steamlogin['logoutpage']);
session_start();
unset($_SESSION['steamid']);
unset($_SESSION['steam_uptodate']);
?>