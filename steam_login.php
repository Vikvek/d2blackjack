<?php
ob_start();
session_start();

function steamlogout() {
    echo "<form action=\"includes/logout.php\" method=\"post\"><input value=\"Logout\" type=\"image\" src=\"assets/png/logout.png\"/></form>"; //logout button
}

function steamlogin() 
{
	    try {
        	require("includes/settings.php");
        	require 'includes/openid.php';
            include_once ("includes/db.php");
            $openid = new LightOpenID($steamlogin['domainname']);
            $_STEAMAPI = ($steamlogin['apikey']);

            $button['small'] = "small";
    		$button['large_no'] = "large_noborder";
    		$button['large'] = "large_border";
    		$button = $button[$steamlogin['buttonstyle']];

            if(!$openid->mode) {
                if(isset($_GET['login'])) {
                    $openid->identity = 'http://steamcommunity.com/openid/?l=english';
                    header('Location: ' . $openid->authUrl());
                } else {
                echo "<form action='?login' method='post'>";
                echo "<input type='image' src='http://cdn.steamcommunity.com/public/images/signinthroughsteam/sits_".$button.".png'>";
                echo "</form>";
                }
            } elseif($openid->mode == 'cancel') {
                echo 'User has canceled authentication!';
            } else {
                if($openid->validate()) {
                $id = $openid->identity;
                $ptn = "/^http:\/\/steamcommunity\.com\/openid\/id\/(7[0-9]{15,25}+)$/";
                preg_match($ptn, $id, $matches);

                $_SESSION['steamid'] = $matches[1]; 
                    if (isset($steamlogin['loginpage'])) {
					    header('Location: '.$steamlogin['loginpage']);
                    }
 
                $url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=$_STEAMAPI&steamids=$matches[1]";
                $json_object= file_get_contents($url);
                $json_decoded = json_decode($json_object);
 
                foreach ($json_decoded->response->players as $player)
                {
                    //MySQLi procedural
                    $sql_fetch_id = "SELECT * FROM users_steam WHERE steamid = '$player->steamid'";
                    $query_id = mysqli_query($db, $sql_fetch_id);

                    $_SESSION['welcome'] = 'back';

                    if (mysqli_num_rows($query_id) == 0) {
                        $sql_steam = "INSERT INTO users_steam (name, steamid, avatar) VALUES  ('$player->personaname', '$player->steamid', '$player->avatar')";
                        mysqli_query($db, $sql_steam);
                        $_SESSION['welcome'] = '';

                    }
                }
                } else {
                    echo "User is not logged in.\n";
                }
            }
        } catch(ErrorException $e) {
            echo $e->getMessage();
        }
}
?>
