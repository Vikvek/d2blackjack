<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
	<title>Dota 2 Blackjack</title>

    <!-- CSS -->
    <link rel="stylesheet" href="assets/stylesheets/main.css">
    <link rel="stylesheet" href="assets/stylesheets/responsive.css" media="screen and (max-width: 1810px)">

    <!-- Sweet Alert -->
    

    <!-- JavaScript -->

    
    <!-- jQueer -->
    <script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
    <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>


    <?php
    //Steam Login PHP
    require 'steam_login.php';
    ?>

    <!-- Taranesc, dar ce sa ii faci -->
    <script type="text/javascript"> var currentSteamID;</script>
    <script type="text/javascript"> var currentSteamID = "<?php echo $_SESSION['steamid']; ?>";</script>

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
            }     
        ?>
        </div> <!-- End of .login Class -->

    	       <!-- Order matters, first is first from right to left -->
    	<div class="settings">
    		<img src="assets/png/settings.png" alt="settings" >
    		<ul class="settingsDropdown">
                	<li><a href="#">My Account</a></li>
                	<li><a href="#">Deposit</a></li>
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

<div class="wrapper">
    <form class="depositForm" method="post" action="deposit.php">
    Deposit Amount: <input type="text" name="depositAmount" />
    <input type="submit" name="submit" value="Deposit" />  
    </form>
    <script type="text/javascript">
        $('form.depositForm').on('submit', function() {
            //Get deposit amount
            value = $("[name=depositAmount]").val();

            //Deposit amount floated, ready to be sent
            depositCredits = parseFloat(value)

              $.ajax({
                type: 'POST',
                url: 'update_credits.php',
                data: {sendCredits: depositCredits, sendSteamid: currentSteamID, sendType: "deposit"},
                success: function(data)
                {   
                    console.log("You succesfully deposited: " + depositCredits + " credits");
                }
                });
            return false;
        });
    </script>
    <p>=============================================================================================================================</p>
    <p>This works as inteded since it's a rough sketch of the actual deposit system, for now it only takes the value you input and adds it to your current credits</p>
    <p>PS: You can also write negative values, text, and you can perform an SQL Injection through here, nasty :)</p>
    <p>=============================================================================================================================</p>
    <p>Deposit system works perfectly, use sendType: "deposit" to declare if it is a deposit</p>
    <p>=============================================================================================================================</p>
    <p>Also splitting cause a bug, I believe, the amount of credits you are left with after the round ends is correctly changed in player.json</p>
    <p>But not in the MySQL database</p>
    <p>=============================================================================================================================</p>
    <p>There are some things that must be changed/remade:</p>
    <ul>
        <li>1. players.json and MySQL must be updated at the same time so they don't cause problems to each other</li>
        <li>2. PHP sends currentSteamID value to javascript by 'o metoda taraneasca'</li>
        <li>3. ???</li>
    </ul>
    <p>=============================================================================================================================</p>
    <p>Some other 'known' bugs include:</p>
    <ul>
        <li>1. Sometimes User Credits show up as $NaN.NaN on index.php (Fixed by Refreshing)(Workaround by setting redirect page after login to index.php)</li>
        <li>2. Credits show as $NaN.NaN if user is not logged in (Change so it displays 'please log in')</li>
    </ul>

</div>

<?php
    // This is redudant and buggy if I use ajax to send to update_credits.php
    //Checks if the user is logged in
    if(isset($_SESSION['steamid'])) {
    // If user presses deposit button do
    /*
        if (isset($_POST['depositAmount'])){
            
            //Include necesary files
            include ("includes/userInfo.php");
            include_once ("includes/db.php");

            $depositAmount = $_POST['depositAmount'];
            $credits = (float)$depositAmount;
            $steamid = $steamprofile['steamid'];

            //Check credits
            $sql_fetch_credits = "SELECT credits FROM users_steam WHERE steamid = '$steamid'";
            $credits_col = mysqli_query($db, $sql_fetch_credits);

            //If credits are not null, update value else insert new value
            // Rough sketch of deposit system
            if (!empty($credits_col)){
                    $sql_deposit_update = "UPDATE users_steam SET credits = credits + '$credits' WHERE steamid = $steamid";
                    mysqli_query($db, $sql_deposit_update);
            }else if (empty($credits_col)){
                    $sql_deposit = "INSERT INTO users_steam (credits) VALUES  ('$credits') WHERE steamid = $steamid";
                    mysqli_query($db, $sql_deposit);
            }
            // Redirects us to same page after we are done, prevents us from resubmitting
            header("Location:deposit.php");
        }
    */
    } else {
        // If user is not logged in display this
        echo "<div class=\"wrapper\">";
        echo "================================</br>";
        echo "Please log in before depositing!</br>";
        echo "================================";
        echo "</div>";
    }
?>

<footer>
    <div class="botNavBar">
        <div class="wrapper">
            <p>Powered by steam, lolz</p>
        </div>
    </div> <!-- end of .botNavBar -->
</footer>