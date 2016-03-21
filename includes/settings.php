<?php
$steamlogin['apikey'] = "81BFF011C309C1DDE5AF87E6F47440CD"; // Your Steam WebAPI-Key 
$steamlogin['domainname'] = "localhost"; // The main URL of your website displayed in the login page
$steamlogin['buttonstyle'] = "large_no"; // Style of the login button [small|large_no|large]
$steamlogin['logoutpage'] = "./index.php"; // Page to redirect to after a successfull logout!
$steamlogin['loginpage'] = "./index.php"; // Page to redirect to after a successfull login 

// System stuff
if (empty($steamlogin['apikey'])) {die("<div style='display: block; width: 100%; background-color: red; text-align: center;'>SteamAuth:<br>Please supply an API-Key!</div>");}
if (empty($steamlogin['domainname'])) {$steamlogin['domainname'] = "localhost";}
if ($steamlogin['buttonstyle'] != "small" and $steamlogin['buttonstyle'] != "large") {$steamlogin['buttonstyle'] = "large_no";}
?>
