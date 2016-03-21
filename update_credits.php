<?php
//----------------------------------------------------------------------
// Copyright (c) 2016 Andy Alexa, d2blackjack.com |All Rights Reserved|
//----------------------------------------------------------------------

//MySQL --PHP--> players.json --AJAX--> Blackjack --AJAX--> |update_credits.php| --PHP--> players.json & MySQL

//Updates credits based on sendCredits , sendSteamid, and sendType
//sendType = "deposit" if it's a 'deposit'

if(isset($_POST['sendCredits'])) {   

        //Get posted values from |main.js| 'updatePlayerCredits();' or |deposit.php| 
        $postedCredits = $_POST['sendCredits'];
        $postedSteamid = $_POST['sendSteamid'];
        $postedType = $_POST['sendType'];

        //=========================================
        // Update players.json
        //=========================================

        $getJson = file_get_contents('players.json');
        $data = json_decode($getJson, true);
        
        //Loop trough .json array for steamid, get key and update credits based on that key
        foreach ($data as $key => $value) {
                if ($value['steamid'] == $postedSteamid) {
                        //Check if it's a deposit
                        if ($postedType == "deposit") {
                                //Get result in a variable then turn that variable into a string to avoid 'future problems'
                                $cal = $data[$key]['credits'] + $postedCredits;
                                $data[$key]['credits'] = (string)$cal;
                        } else {
                                $data[$key]['credits'] = $postedCredits;
                        }      
                }
        }

        $newJsonString = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents('players.json', $newJsonString);

        //=========================================
        // Update MySQL database
        //=========================================
        include_once ("includes/db.php");

        $sql_fetch_credits = "SELECT credits FROM users_steam WHERE steamid = '$postedSteamid'";
        $credits_col = mysqli_query($db, $sql_fetch_credits);

        if ($credits_col != $postedCredits) {
                //Check if it's a deposit
                if ($postedType == "deposit") {
                        $sql_credits_update = "UPDATE users_steam SET credits = credits + '$postedCredits' WHERE steamid = $postedSteamid";
                }else {
                        $sql_credits_update = "UPDATE users_steam SET credits = '$postedCredits' WHERE steamid = $postedSteamid";
                }
                mysqli_query($db, $sql_credits_update);
        }      
}
?>