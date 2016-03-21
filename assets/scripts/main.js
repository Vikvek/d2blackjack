//=============================================================================
// Browser detection (fix some CSS issues)
//=============================================================================

//Mozilla Firefox
if ( $.browser.mozilla ) {

  // Set 'defaultbet' and 'credits' strings correctly
  $("#default").css({"bottom": "none", "top": "1.6em"});
  $("#credits").css({"bottom": "none", "top": "1.6em"});

  //Set player buttons correctly
  $(".text").css({"font-size": "280%", "padding": "0 0.24em"});

  //Set card size correctly
  $(".cardArea").css({"font-size": "18pt"});
}


//=============================================================================
// Bet Menu
//=============================================================================

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showBetAmount() {
    document.getElementById("betDropUp").classList.toggle("show");

    // Changes the position of 'credits' and 'default bet' if user opens bet menu.
    if ( $.browser.mozilla ) {
      $("#default").css({"bottom": "none", "top": "-0.3em"});
      $("#credits").css({"bottom": "none", "top": "-0.3em"});
    } else {
      $("#default").css({"bottom": "0em"});
      $("#credits").css({"bottom": "0em"});
    }
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("betAmount");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        // Cea mai 'metoda taraneasca' care am folosit-o
        if (!event.target.matches('#increaseWhite') && !event.target.matches('#increasePink') && !event.target.matches('#increaseRed') && !event.target.matches('#increaseGreen') && !event.target.matches('#increaseBlue') && !event.target.matches('#increaseBlack') && !event.target.matches('#increaseOrange')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  //Set 'credits' and 'default bet' to default position after closing bet menu.
  if (!document.getElementById("betDropUp").classList.contains("show")) {
    if ( $.browser.mozilla ) {
      $("#default").css({"bottom": "none", "top": "1.6em"});
      $("#credits").css({"bottom": "none", "top": "1.6em"});
    } else {
      $("#default").css({"bottom": "-2em"});
      $("#credits").css({"bottom": "-2em"});
    }
  }
}

//=============================================================================
// BLACKJACK
//=============================================================================

// MySQL --PHP--> players.json --|AJAX|--> Blackjack --|AJAX|--> update_credits.php --PHP--> players.json & MySQL

// Define currentSteamID
var currentSteamID;

// Defining initCredit
var initCredit;

// User preferences
var resetBetAfterRound;
var disableAnimations;

// Set initCredits based on players.json
function callback(playerCredits) {
  console.log("Current credits: " + playerCredits);

  // Setting initCredit to be equal to playerCredits
  initCredit = playerCredits;

}

// jQuery AJAX POST player credits & player steam id to update_credits.php
function updatePlayerCredits() {
  $.ajax({
    type: 'POST',
    url: 'update_credits.php',
    data: {sendCredits: credits, sendSteamid: currentSteamID},
    success: function(data)
    {
        console.log("Credits and current SteamID succesfully posted to PHP");
        console.log(credits);
        console.log(currentSteamID);
    }
  });
}


// jQuery AJAX GET player credits
$.ajax({
    type: 'GET',
    url: './players.json',
    dataType: 'json',
    success: function(data) {
      console.log('.json Parsed Succesfully');
      var items = data;
      for(var i = 0; i < items.length; i++){
        if(items[i].steamid == currentSteamID) {
          var playerCredits = parseFloat(items[i].credits);

          // Set initial credits
          callback(playerCredits);
        }
      }
    }
});

// Reloads the page if the initCredit is NaN
function checkCredits() {
  if (isNaN(initCredit)) {
    window.location.reload();
  }
}

//=============================================================================
// Card and Stack Objects
//=============================================================================

//-----------------------------------------------------------------------------
// Card constructor function.
//-----------------------------------------------------------------------------

function Card(rank, suit) {

  this.rank = rank;
  this.suit = suit;

  this.createNode = cardCreateNode;
}

//-----------------------------------------------------------------------------
// cardCreateNode(): Returns a DIV node which can be used to display the card
// on a page.
//-----------------------------------------------------------------------------

// Preload graphics.

var cardImg0 = new Image(); cardImg0.src= "assets/png/cardback.png";
var cardImg1 = new Image(); cardImg1.src= "assets/png/jack.png";
var cardImg2 = new Image(); cardImg2.src= "assets/png/queen.png";
var cardImg3 = new Image(); cardImg3.src= "assets/png/king.png";
var cardImg4 = new Image(); cardImg4.src= "assets/png/ace.png";

function cardCreateNode() {

  var cardNode, frontNode, indexNode, spotNode, tempNode, textNode;
  var indexStr, spotChar;

  // This is the main node, a DIV tag.

  cardNode = document.createElement("DIV");
  cardNode.className = "card";

  // Build the front of card.

  frontNode = document.createElement("DIV");
  frontNode.className = "front";

  // Get proper character for card suit and change font color if necessary.

  spotChar = "\u00a0";
  switch (this.suit) {
    case "C" :
      spotChar = "\u2663";
      break;
    case "D" :
      frontNode.className += " red";
      spotChar = "\u2666";
      break;
    case "H" :
      frontNode.className += " red";
      spotChar = "\u2665";
      break;
    case "S" :
      spotChar = "\u2660";
      break;
  }

  // Create and add the index (rank) to the upper-left corner of the card.

  indexStr = this.rank;
  if (this.toString() == "")
    indexStr = "\u00a0";
  spotNode = document.createElement("DIV");
  spotNode.className = "index";
  textNode = document.createTextNode(indexStr);
  spotNode.appendChild(textNode);
  spotNode.appendChild(document.createElement("BR"));
  textNode = document.createTextNode(spotChar);
  spotNode.appendChild(textNode);
  frontNode.appendChild(spotNode);

  // For face cards (Jack, Queen or King), create and add the proper image.


  tempNode = document.createElement("IMG");
  tempNode.className = "face";
  if (this.rank == "J")
    tempNode.src = "assets/png/jack.png";
  if (this.rank == "Q")
    tempNode.src = "assets/png/queen.png";
  if (this.rank == "K")
    tempNode.src = "assets/png/king.png";
  if (this.rank == "A")
    tempNode.src = "assets/png/ace.png";


   if (this.rank == "J" || this.rank == "Q" || this.rank == "K" || this.rank == "A") {
    frontNode.appendChild(tempNode);
  }

  // Add front node to the card node.

  cardNode.appendChild(frontNode);

  // Return the card node.

  return cardNode;
}



//-----------------------------------------------------------------------------
// Stack constructor function.
//-----------------------------------------------------------------------------

function Stack() {

  // Create an empty array of cards.

  this.cards = new Array();

  this.makeDeck  = stackMakeDeck;
  this.shuffle   = stackShuffle;
  this.deal      = stackDeal;
  this.cardCount = stackCardCount;
}

//-----------------------------------------------------------------------------
// stackMakeDeck(n): Initializes a stack using 'n' packs of cards.
//-----------------------------------------------------------------------------

function stackMakeDeck(n) {

  var ranks = new Array("A", "2", "3", "4", "5", "6", "7", "8", "9",
                        "10", "J", "Q", "K");
  var suits = new Array("C", "D", "H", "S");
  var i, j, k;
  var m;

  m = ranks.length * suits.length;

  // Set array of cards.

  this.cards = new Array(n * m);

  // Fill the array with 'n' packs of cards.

  for (i = 0; i < n; i++)
    for (j = 0; j < suits.length; j++)
      for (k = 0; k < ranks.length; k++)
        this.cards[i * m + j * ranks.length + k] = new Card(ranks[k], suits[j]);
}

//-----------------------------------------------------------------------------
// stackShuffle(n): Shuffles a stack of cards 'n' times.
//-----------------------------------------------------------------------------

function stackShuffle(n) {

  var i, j, k;
  var temp;

  // Shuffle the stack 'n' times.

  for (i = 0; i < n; i++)
    for (j = 0; j < this.cards.length; j++) {
      k = Math.floor(Math.random() * this.cards.length);
      temp = this.cards[j];
      this.cards[j] = this.cards[k];
      this.cards[k] = temp;
    }
}

//-----------------------------------------------------------------------------
// stackDeal(): Removes the first card in the stack and returns it.
//-----------------------------------------------------------------------------

function stackDeal() {

  if (this.cards.length > 0)
    return this.cards.shift();
  else
    return null;
}

//-----------------------------------------------------------------------------
// stackCardCount(): Returns the number of cards currently in the stack.
//-----------------------------------------------------------------------------

function stackCardCount() {

  return this.cards.length;
}

// ============================================================================
// OPTIONS
// ============================================================================

// Constants.

var numPacks      =    8;  //Number of decks used 8*52 = 416 cards
var numShuffles   =   10;  //Make players choose how many shuffles take place min:2 (change to preference)

var maxSplits     =    1;  //Maximum number of splits

var minBet        =    0;  //Minimum bet
var maxBet        = 1000; //Maximum bet
var initBet       =    0;   //Starting bet

var dealTimeDelay =  450;  //How fast are the cards dealt (change to preference)

// Globals.

var deck;
var burnCard; // Change to preference pehaps

var dealer;
var player = new Array(maxSplits + 1);
var curPlayerHand, numPlayerHands;

var credits, defaultBet;
var creditsTextNode, defaultTextNode;

var dealRoundCounter;

// Initialize game on page load.

window.onload = initGame;

function initGame() {
  if (currentSteamID !== undefined) {

  var i;

  // Locate credits and default bet text nodes on the page.

  creditsTextNode = document.getElementById("credits").firstChild;
  defaultTextNode = document.getElementById("default").firstChild;

  // Initialize player's credits and bet amount.

  credits    = initCredit;
  defaultBet = initBet;
  changeBet(0);
  updateBetDisplay(0);

  checkCredits();

  // Initialize card deck.

  deck = new Stack();
  newDeck();

  // Create dealer and player hands.

  dealer = new Hand("dealer");
  for (i = 0; i < player.length; i++) {
    player[i] = new Hand("player" + i);
  }

  if (disableAnimations === true) {
    $(".betAmount").css({"animation-name": "none", "animation-duration": "none"});
  }

  } else {

    // Don't display credits and default bet if player not logged in
    document.getElementById("credits").style.display = "none";
    document.getElementById("default").style.display = "none";

    // Don't display buttons if user is not logged in
    document.getElementById("controls").style.display = "none";

    // Don't display playingField if user is not logged in
    document.getElementById("dealer").style.display = "none";
    document.getElementById("player0").style.display = "none";
    document.getElementById("player1").style.display = "none";

    // Tell the user to log in before playing
    swal({
      title: "Please log in before playing!",
      confirmButtonColor: "#8e2b25",
      confirmButtonText: "Got it!"
    });
  }
}

// ----------------------------------------------------------------------------
// hand object.
// ----------------------------------------------------------------------------

Hand.prototype.leftIncr  =  2.5;  // For positioning cards.
Hand.prototype.topIncr   =  0.2;
Hand.prototype.rollEvery =  5;

function Hand(id) {

  this.cards = new Array();

  // Get page elements based on id.

  this.fieldNode     = document.getElementById(id);
  this.cardsNode     = document.getElementById(id + "Cards");
  this.scoreTextNode = document.getElementById(id + "Score").firstChild;
  if (id != "dealer") {
    this.betTextNode    = document.getElementById(id + "Bet").firstChild;
    this.resultTextNode = document.getElementById(id + "Result").firstChild;
  }

  this.reset      = handReset;
  this.addCard    = handAddCard;
  this.removeCard = handRemoveCard;
  this.getScore   = handGetScore;
  this.clearCards = handClearCards;

  // Initialize as an empty hand.

  this.reset();
}

function handReset() {

  // Remove any cards and initialize properties.

  this.clearCards();

  this.cards     = new Array();
  this.blackjack = false;
  this.split     = false;
  this.doubled   = false;
  this.left      = 0;
  this.top       = 0;

  this.scoreTextNode.nodeValue  = "\u00a0";
  if (this.betTextNode) {
    this.betTextNode.parentNode.className = "textBox dollars";
    this.betTextNode.nodeValue = "\u00a0";
  }
  if (this.resultTextNode)
    this.resultTextNode.nodeValue = "\u00a0";
}

function handAddCard(card, down) {

  var n;
  var node;

  // Add the given card to the hand.

  n = this.cards.length;
  this.cards[n] = card;

  // Create a card node for display, set as face down if requested.

  node = this.cards[n].createNode();
  if (down)
    node.firstChild.style.visibility = "hidden";

  // Add the card display to the associated card area on the page.

  node.style.left = this.left + "em";
  node.style.top  = this.top  + "em";
  this.cardsNode.appendChild(node);
  this.left += this.leftIncr;
  if (this.cards.length % this.rollEvery == 0)
    this.top = 0;
  else
    this.top += this.topIncr;
}

function handRemoveCard() {

  var card;

  // Remove the last card in the array and save it.

  card = null;
  if (this.cards.length > 0) {
    card = this.cards.pop();

    // Remove the card node from the display and reset position.

    this.cardsNode.removeChild(this.cardsNode.lastChild);
    this.left -= this.leftIncr;
    this.top  -= this.topIncr;
  }

  // Return the card.

  return card;
}

function handGetScore() {

  var i, total;

  total = 0;

  // Total card values counting Aces as one.

  for (i = 0; i < this.cards.length; i++)
    if (this.cards[i].rank == "A")
      total++;
    else {
      if (this.cards[i].rank == "J" || this.cards[i].rank == "Q" ||
          this.cards[i].rank == "K")
        total += 10;
      else
        total += parseInt(this.cards[i].rank, 10);
    }

  // Change as many ace values to 11 as possible.

  for (i = 0; i < this.cards.length; i++)
    if (this.cards[i].rank == "A" && total <= 11)
      total += 10;

  return total;
}

function handClearCards() {

  // Remove the card nodes in the associated card area.

  while (this.cardsNode.lastChild)
    this.cardsNode.removeChild(this.cardsNode.lastChild);
}

// ----------------------------------------------------------------------------
// Game functions.
// ----------------------------------------------------------------------------

function newDeck() {

  // Create a deck.

  deck.makeDeck(numPacks);
  deck.shuffle(numShuffles);

  // Set the burn card.

  burnCard = Math.round(Math.random() * 26) + 26; // Make users choose burn card
}

function getNextCard() {

  // If there are no cards left, start a new deck.

  if (deck.cardCount() == 0) {
     swal({
      title: "There are no cards left: New Deck!",
      confirmButtonColor: "#8e2b25",
      confirmButtonText: "Got it!"
    });
    newDeck();
  }

  return deck.deal();
}

//Modified by ME
function startRound() {
  if (defaultBet !== 0) {

    var i;

    // Reset all hands.

    dealer.reset();
    for (i = 0; i < player.length; i++) {
      player[i].reset();
      if (i > 0)
        player[i].fieldNode.style.display = "none";
    }

    // Start with a single player hand.

    curPlayerHand  = 0;
    numPlayerHands = 1;

    //Reset playing field
    $("#player0").css({"width": "100%", "padding": "none"});

    // Playing field properties
    $("#player0Bet").css({"left": "-10em", "bottom": "-2.4em"});
    $("#player0Result").css({"right": "-10em", "bottom": "-2.4em"});

    //CSS Animations
    if (disableAnimations !== true) {
      $(".textBox").css({"animation-name": "hudFadeIn", "animation-duration": "3s", "opacity": "1"});
      $(".result").css({"animation-name": "none", "animation-duration": "none", "animation-iteration-count": "none"});
    } else {
      $(".textBox").css({"animation-name": "none", "animation-duration": "none", "opacity": "1"});
    }

    // Enable/disable buttons.

    document.forms["controls"].elements["deal"].disabled      = true;

    document.forms["controls"].elements["betButton"].disabled  = true;
    document.forms["controls"].elements["increaseWhite"].disabled  = true;
    document.forms["controls"].elements["increasePink"].disabled  = true;
    document.forms["controls"].elements["increaseRed"].disabled  = true;
    document.forms["controls"].elements["increaseGreen"].disabled  = true;
    document.forms["controls"].elements["increaseBlue"].disabled  = true;
    document.forms["controls"].elements["increaseBlack"].disabled  = true;
    document.forms["controls"].elements["increaseOrange"].disabled  = true;
    document.forms["controls"].elements["resetbet"].disabled  = true;
    DisablePlayButtons();

    // If the burn card was reached, start a new deck.

    if (deck.cardCount() < burnCard) {
          swal({
      title: "Burn card was reached: New Deck!",
      confirmButtonColor: "#8e2b25",
      confirmButtonText: "Got it!"
      });
      newDeck();
    }

    // Take the player's bet.

    player[0].bet = defaultBet;
    credits -= player[0].bet;
    updateBetDisplay(0);

    // Start dealing the cards.
    dealRoundCounter = 1;
    dealRound();

  } else if (defaultBet == 0 && credits == 0) {
    swal({
      title: "Please deposit before playing!",
      text: "Would you like to be redirected to the deposit page?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8e2b25",
      confirmButtonText: "Yes!"
    },
    function (){
      window.location.replace("deposit.php");
    });
  } else {
    swal({
      title: "Bet first!",
      confirmButtonColor: "#8e2b25",
      confirmButtonText: "Got it!"
    });
  }

}

function dealRound()
{

  // Deal a card to the player or the dealer based on the counter.

  switch(dealRoundCounter)
  {
    case 1:
      player[0].addCard(getNextCard(), false);
      break;

    case 2:
      dealer.addCard(getNextCard(), true);
      break;

    case 3:
      player[0].addCard(getNextCard(), false);
      break;

    case 4:
      dealer.addCard(getNextCard(), false);
      break;

    default:

      // No more cards to deal, play the round.

      playRound();
      return;
      break;
  }

  // Update the player's score.

  if (player[0].getScore() == 21) {
    player[0].blackjack = true;
    player[0].scoreTextNode.nodeValue = "Blackjack";
  }
  else
    player[0].scoreTextNode.nodeValue = player[0].getScore();

  // Set a timer for the next call.

  dealRoundCounter++;
  setTimeout(dealRound, dealTimeDelay);
}

function playRound() {

  // Check for dealer blackjack.

  if (dealer.getScore() == 21) {
    dealer.blackjack = true;
    dealer.scoreTextNode.nodeValue = "Blackjack";
  }

  // If player or dealer has blackjack, end the round.

  if (player[0].blackjack || dealer.blackjack) {
    endRound();
    return;
  }

  // Enable/disable buttons.

  if (canSplit()) {
    document.forms["controls"].elements["split"].disabled     = false;
  }

  // Checks if the player can double or not (Changed by Me)
  if (credits - player[curPlayerHand].bet < 0) {
    document.forms["controls"].elements["double"].disabled  = true;
  } else if (credits - player[curPlayerHand].bet >= 0 ) {
    document.forms["controls"].elements["double"].disabled  = false;
  }

  document.forms["controls"].elements["hit"].disabled       = false;
  document.forms["controls"].elements["stand"].disabled     = false;
}

function playerSplit() {

  var m, n;
  var card, node;

  // Enable/disable buttons.

  DisablePlayButtons();

  // Update the number of player hands.
  m = curPlayerHand;
  n = numPlayerHands;
  numPlayerHands++;

  // Note the split.
  player[m].split = true;
  player[n].split = true;

  //Change settings of play fieldset
  $("#player0").css({"width": "49.7%", "padding": "1%"});

  $("#player0Bet").css({"left": "0", "bottom": "-1.2em"});
  $("#player0Result").css({"right": "0", "bottom": "-1.2em"});

  // Remove the second card from the current hand and add it to a new hand.
  card = player[m].removeCard();
  player[m].scoreTextNode.nodeValue = player[m].getScore();
  player[n].addCard(card, false);
  player[n].scoreTextNode.nodeValue = player[n].getScore();
  player[n].fieldNode.style.display = "";

  // Update bet and credits.

  player[n].bet = player[m].bet;
  credits -= player[n].bet;
  updateBetDisplay(n);
  updateBetDisplay(n + 1);

  // Give the current hand a second card.

  setTimeout(playerHit, dealTimeDelay);
}

function playerDouble() {

  player[curPlayerHand].bet *= 2;
  credits -= defaultBet;
  updateBetDisplay(curPlayerHand);
  player[curPlayerHand].doubled = true;
  player[curPlayerHand].top = 0;
  playerHit();

}

function playerHit() {

  var n, p;

  // Enable/disable buttons.

  DisablePlayButtons();
  document.forms["controls"].elements["hit"].disabled   = false;
  document.forms["controls"].elements["stand"].disabled = false;

  // Give the player another card and find total.

  n = curPlayerHand;
  player[n].addCard(getNextCard(), false);
  p = player[n].getScore();

  // If the player has busted, go to the next hand.
  if (p > 21) {
    player[n].scoreTextNode.nodeValue =  "Busted (" + p + ")";
    startNextHand();
    return;
  }
  else
    player[n].scoreTextNode.nodeValue = p;

  // If the player has reached 21, or is doubling down, go on to the next hand.

  if (p == 21 || player[n].doubled) {
    startNextHand();
    return;
  }

  // Handle second card on split hands.
  if (player[n].split && player[n].cards.length == 2) {

    // If Aces were split, go on to next hand.

    if (player[n].split && player[n].cards[0].rank == "A") {
        startNextHand();
        return;
    }

    //Disable doubling down after 'split' (also fixes nasty bug) (RULES)
    document.forms["controls"].elements["double"].disabled = true;
    if (canSplit())
      document.forms["controls"].elements["split"].disabled = false;
  }
}

function playerStand() {

  // Go on to the next hand.

  startNextHand();
}

function startNextHand() {

  // Go on to the next player hand or the dealer.

  curPlayerHand++;
  if (curPlayerHand >= numPlayerHands) {
    startDealer();
    return;
  }
  else {
    addClassName(player[curPlayerHand].fieldNode, "activeField");

    // Enable/disable buttons.

    DisablePlayButtons();

    // Give a split hand a second card.

    if (player[curPlayerHand].split)
      setTimeout(playerHit, dealTimeDelay);
  }
}

function startDealer() {

  var i, allBusts;

  // Enable/disable buttons.

  DisablePlayButtons();

  // If player has busted on all hands, end the round.

  allBusts = true;
  for (i = 0; i < numPlayerHands; i++)
    if (player[i].getScore() <= 21)
      allBusts = false;
  if (allBusts) {
    endRound();
    return;
  }

  // show the down card and score and
  // play the hand.
  dealer.cardsNode.firstChild.firstChild.style.visibility = "";
  dealer.scoreTextNode.nodeValue = dealer.getScore();
  setTimeout(playDealer, dealTimeDelay);
}

function playDealer() {

  var d;

  // Get and show the dealer's score.

  d = dealer.getScore();
  dealer.scoreTextNode.nodeValue = d;

  // If the dealer's total is less than 17, set up to deal another card.

  if (d < 17) {
    setTimeout(dealToDealer, dealTimeDelay);
    return;
  }

  // Check if the dealer busted.

  if (d > 21)
    dealer.scoreTextNode.nodeValue = "Busted (" + d + ")";

  endRound();
}

function dealToDealer() {

  // Give the dealer another card and check the result.

  dealer.addCard(getNextCard(), false);
  playDealer();
}

function endRound() {

  var i, d, p, tmp;

  // Enable/disable buttons.

  document.forms["controls"].elements["deal"].disabled = false;
  EnableBetButtons();
  DisablePlayButtons();

  // Fix for IE 6 rendering bug.

  if (navigator.userAgent.indexOf("MSIE 6") >= 0) {
    dealer.cardsNode.firstChild.style.backgroundImage = "none";
    dealer.cardsNode.firstChild.style.backgroundColor = "white";
  }

  // Show the dealer's down card and score.

  dealer.cardsNode.firstChild.firstChild.style.visibility = "";
  d = dealer.getScore();
  if (!dealer.blackjack && d <= 21)
    dealer.scoreTextNode.nodeValue = d;

  // Show result of each player hand and pay it off, if appropriate.
  // Shitty programming no hard blackjacks EDIT : it is intended

  for (i = 0; i < numPlayerHands; i++) {
    p = player[i].getScore();
    if ((player[i].blackjack && !dealer.blackjack) ||
             (p <= 21 && d > 21) || (p <= 21 && p > d)) {
      player[i].resultTextNode.nodeValue = "Player Wins";
      tmp = 2 * player[i].bet;

      // Blackjack pays 3 to 2. (RULES)
      if (player[i].blackjack) {
        tmp += player[i].bet / 2;
      }

      player[i].bet = tmp;
      credits += player[i].bet;
    }
    else if ((dealer.blackjack && !player[i].blackjack) ||
             p > 21 || p < d) {
      player[i].resultTextNode.nodeValue = "Player Loses";
      addClassName(player[i].betTextNode.parentNode, "lost");
      checkBet()
    }
    else {
      player[i].resultTextNode.nodeValue = "Push";
      credits += player[i].bet;
    }

    if (resetBetAfterRound === true) {
      resetBet();
    }

    if (disableAnimations !== true) {
      $(".result").css({"animation-name": "resultBG", "animation-duration": "1s", "animation-iteration-count": "infinite"});
    }

    updateBetDisplay(i);
    updatePlayerCredits();
  }
}

function canSplit() {

  var n;




  // Has the split limit has been reached?
  if (numPlayerHands > maxSplits) {
    return false;
  }

  // Check for a pair.

  n = curPlayerHand;
  if (player[n].cards[0].rank == player[n].cards[1].rank) {
    // Checks if the player has enough credits to split (Changed by me)
    if (credits - player[curPlayerHand].bet < 0 ) {
      return false;
    } else if (credits - player[curPlayerHand].bet >= 0 ) {
      return true;
    }
  }

  // Also, allow tens and face cards to match as a pair.

  if ((player[n].cards[0].rank == "10" ||
       player[n].cards[0].rank == "J"  ||
       player[n].cards[0].rank == "Q"  ||
       player[n].cards[0].rank == "K") &&
      (player[n].cards[1].rank == "10" ||
       player[n].cards[1].rank == "J"  ||
       player[n].cards[1].rank == "Q"  ||
       player[n].cards[1].rank == "K")) {
        // Checks if the player has enough credits to split (Changed by me)
         if (credits - player[curPlayerHand].bet < 0 ) {
           return false;
         } else if (credits - player[curPlayerHand].bet >= 0 ) {
           return true;
         }
       }

  //Set to true if you want to split every hand (RULES)
  return false;
}

function updateBetDisplay(n) {

  var s;

  // Display the current bet on the given hand.

  if (player[n]) {
    if (player[n].bet != null)
      s = "Bet: " + formatDollar(player[n].bet);
    else
      s = "\u00a0";
    player[n].betTextNode.nodeValue = s;
  }

  // Display current credits.

  creditsTextNode.nodeValue = formatDollar(credits);
}

function formatDollar(n) {

  var a, b;

  // Format the given number as a dollar amount for display.

  a = Math.abs(n);
  b = 100 * (a - Math.floor(a));
  if (b < 10)
    b = "0" + b;
  return (n < 0 ? "-" : "" ) + "$" + Math.floor(a) + "." + b;
}

function changeBet(n) {

  // Increase or decrease the default bet.
  if(defaultBet < credits ) {
  defaultBet += n;
  if(defaultBet > credits)defaultBet = credits;
  defaultTextNode.nodeValue = "Bet: " + formatDollar(defaultBet);
}
  // Reset the increase/decrease buttons.

  EnableBetButtons();
}

// Reset Current Bet (Changed By Me)
function resetBet() {
  defaultBet -= defaultBet;
  defaultTextNode.nodeValue = "Bet: " + formatDollar(defaultBet);

  //Disable reset button after pressing it :D
  document.forms["controls"].elements["resetbet"].disabled = true;
}

// Checks the bet so it doesnt go -negative (Changed by me)
function checkBet() {
  if (defaultBet > credits || credits == 0) {
    defaultBet -= defaultBet;
    defaultTextNode.nodeValue = "Bet: " + formatDollar(defaultBet);
  }
}

function EnableBetButtons() {

  // Enable the increase and decrease bet buttons provided the current bet
  // amount is within the allowed min/max value.
  document.forms["controls"].elements["betButton"].disabled  = false;
  document.forms["controls"].elements["increaseWhite"].disabled = (defaultBet >= maxBet);
  document.forms["controls"].elements["increasePink"].disabled = (defaultBet >= maxBet);
  document.forms["controls"].elements["increaseRed"].disabled = (defaultBet >= maxBet);
  document.forms["controls"].elements["increaseGreen"].disabled = (defaultBet >= maxBet);
  document.forms["controls"].elements["increaseBlue"].disabled = (defaultBet >= maxBet);
  document.forms["controls"].elements["increaseBlack"].disabled = (defaultBet >= maxBet);
  document.forms["controls"].elements["increaseOrange"].disabled = (defaultBet >= maxBet);
  document.forms["controls"].elements["resetbet"].disabled = (defaultBet == 0);
}

function DisablePlayButtons() {

  // Disable all the buttons used for playing a hand.
  document.forms["controls"].elements["split"].disabled     = true;
  document.forms["controls"].elements["double"].disabled    = true;
  document.forms["controls"].elements["hit"].disabled       = true;
  document.forms["controls"].elements["stand"].disabled     = true;
}

function addClassName(el, name)
{

  // Remove the class name if it already exists in the element's class name
  // list.
  removeClassName(el, name);

  // Add the class name to the element's current list of class names.
  if (el.className.length > 0)
    name = " " + name;
  el.className += name;
}

function removeClassName(el, name)
{
  // If the element has no class names, exit.
  if (el.className == null)
    return;

  // Rebuild the list of class names on the element but exclude the specified
  // class name.

  var newList = new Array();
  var curList = el.className.split(" ");
  for (var i = 0; i < curList.length; i++)
    if (curList[i] != name)
      newList.push(curList[i]);
  el.className = newList.join(" ");
}
