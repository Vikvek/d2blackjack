<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
	<title>Dota 2 Blackjack</title>

    <!-- CSS -->
    <link rel="stylesheet" href="assets/stylesheets/main.css"/>
    <link rel="stylesheet" href="assets/stylesheets/responsive.css" media="screen and (max-width: 1810px)"/>

    <!-- Sweet Alert -->
    <link rel="stylesheet" href="assets/swal/sweetalert.css">
    <script src="assets/swal/sweetalert.js"></script>

    <?php
    //Steam Login PHP
    require 'steam_login.php';
    ?>

    <!-- Taranesc, dar ce sa ii faci -->
    <script type="text/javascript">
      var currentSteamID = "<?php echo $_SESSION['steamid']; ?>";
    </script>

</head>

<body>

<header>
    <div class="topNavBar">
    	<div class="wrapper">
        <h1><a href="index.php"> Dota 2 <span id="bj">Blackjack</span></a></h1>

        <div class="login">
        <?php
        if(!isset($_SESSION['steamid'])) {

        echo "<div id=\"loginbutton\">";
            steamlogin(); //login button
        echo "</div>";

        }  else {

        include ('includes/userInfo.php'); //To access the $steamprofile array

        $steamprofile['welcome'] = $_SESSION['welcome'];
        echo "<div id=\"avatar\">";
            echo '<img src="'.$steamprofile['avatarmedium'].'"/>'; // Display their avatar!
        echo "</div>";

        echo "<div id=\"welcome\">";
            echo "Welcome " . $steamprofile['welcome'] . "<br>" . "<div id=\"welcomeName\">" . $steamprofile['personaname'] . "</div>";
            steamlogout();
        echo "</div>";

        //MySQL --|PHP|--> players.json --AJAX--> Blackjack --AJAX--> update_credits.php --PHP--> players.json & MySQL
        //If user is connected send info about him in players.json to be later used in our game
        include_once ("includes/db.php");

        $steam_id = $_SESSION['steamid'];

        $sql_fetch_info = "SELECT * FROM users_steam WHERE steamid = $steam_id";

			  $response = array();
			  $players = array();
			  $result = mysqli_query($db, $sql_fetch_info);
			    while($row=mysqli_fetch_array($result)) {
				    $name=$row['name'];
				    $steamid=$row['steamid'];
				    $credits=$row['credits'];

				    $players = array('name'=> $name, 'steamid'=> $steamid,'credits'=> $credits);
			    }

			    $data_results = file_get_contents('players.json');
          $tempArray = json_decode($data_results, true);

           // Gives error if .json file is empty but fixing that breaks other things for now
           if (!in_array($players, $tempArray)) {
               //Append to json file after checking if it exists
               $tempArray[] = $players;
               $jsonData = json_encode($tempArray, JSON_PRETTY_PRINT);

               //Write to file
               file_put_contents('players.json', $jsonData);
           }  else if (empty($tempArray)) {
                $jsonData = json_encode($players, JSON_PRETTY_PRINT);

                //Write to file
                file_put_contents('players.json', $jsonData);
              }
           }
        ?>
        </div> <!-- End of .login Class -->

    	<!-- Order matters, first is first from right to left -->
    	<div class="settings">
    		<img src="assets/png/settings.png" alt="settings" >
    		<ul class="settingsDropdown">
                	<li><a href="#">My Account</a></li>
                  <li><a href="#">Preferences</a></li>
                	<li><a href="deposit.php">Deposit</a></li>
                	<li><a href="#">Withdraw</a></li>
                	<li><a href="#">History</a></li>
                	<li><a href="#">Chat On Off</a></li>
        	</ul>
        </div>
        <div class="help">
        	<img src="assets/png/help.png" alt="help" >
        	<ul class="helpDropdown">
                	<li><a href="#">How To Play?</a></li>
                	<li><a href="#">Submit Ticket</a></li>
                	<li><a href="#">About</a></li>
        	</ul>
        </div>
        </div> <!-- end of wrapper -->
    </div> <!-- end of .topNavBar -->
</header>
    <!-- Dealer's area. -->

<!-- Main player's area. -->

<div class="playingField">

	<div id="dealer">
  		<div class="textBox name">Dealer</div>
  		<div id="dealerScore" class="textBox">&nbsp;</div>
  		<div id="dealerCards" class="cardArea"></div>
	</div>

	<div id="player0">
  		<div id="player0Name" class="textBox name">Player</div>
  		<div id="player0Score"  class="textBox">&nbsp;</div>
  		<div id="player0Bet"    class="textBox dollars">&nbsp;</div>
  		<div id="player0Result" class="textBox result">&nbsp;</div>
  		<div id="player0Cards"  class="cardArea"></div>
	</div>

<!-- Areas for the player's split hands. -->

	<div id="player1" style="display:none;">
		  <div id="player1Name" class="textBox name">Player (split)</div>
    	<div id="player1Score"  class="textBox">&nbsp;</div>
    	<div id="player1Bet"    class="textBox dollars">&nbsp;</div>
    	<div id="player1Result" class="textBox result">&nbsp;</div>
    	<div id="player1Cards"  class="cardArea"></div>
	</div>


	<div class="betStrings">
		<p id="default">&nbsp;</p>
    <p id="tooltip">+$0.00</p>
		<p id="credits">&nbsp;</p>
	</div>

</div> <!-- End of .playingField -->

<!-- Game buttons. -->

<footer>
    <div class="botNavBar">
    	<div class="wrapper">
        <form id="controls">
            <div id="controlsArea">
                <input id="split"     class="text" type="reset" value="Split" onclick="playerSplit();return false;" disabled="disabled" />
                <input id="stand"     class="text" type="reset" value="Stand" onclick="playerStand();return false;" disabled="disabled" />
                <input id="hit"       class="text" type="reset" value="Hit"   onclick="playerHit();return false;" disabled="disabled" />
                <input id="double"    class="text" type="reset" value="Double Down" onclick="playerDouble();return false;" disabled="disabled" />
                <button onclick="showBetAmount()" type="reset" id="betButton" class="text dropbtn">Bet</button>
                <div id="betDropUp" class="betAmount">
                    <input id="increaseWhite"  class="text" type="reset" value="" onclick="changeBet(+1);return false;" />
                    <input id="increasePink"   class="text" type="reset" value="" onclick="changeBet(+2.5);return false;" />
                    <input id="increaseRed"    class="text" type="reset" value="" onclick="changeBet(+5);return false;" />
                    <input id="increaseGreen"  class="text" type="reset" value="" onclick="changeBet(+10);return false;" />
                    <input id="increaseBlue"   class="text" type="reset" value="" onclick="changeBet(+25);return false;" />
                    <input id="increaseBlack"  class="text" type="reset" value="" onclick="changeBet(+50);return false;" />
                    <input id="increaseOrange" class="text" type="reset" value="" onclick="changeBet(+100);return false;" />
                </div>
                <input id="resetbet"  class="text" type="reset" value="Reset Bet" onclick="resetBet();return false;" />
                <input id="deal"      class="text" type="reset" value="Deal" onclick="startRound();return false;" />

            </div>
        </form>
        </div>
    </div> <!-- end of .botNavBar -->
</footer>

    <!-- jQuery -->
    <script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
    <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>

    <!-- JavaScript -->
    <script src="assets/scripts/main.js"></script>

</body>

</html>
