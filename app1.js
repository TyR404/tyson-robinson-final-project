// Shuffle function from http://stackoverflow.com/a/2450976
let shuffle = function (array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

//object that stores all the info for each card, a boolean value to reset the board, a variable for the score, an array for the next card to match,
//  the current card number used for the index of the next card array, and a boolean value used to allow the user to click on the board
const gameObject = {
  // each card contains a unique card name, a boolean value to see if it has already been matched, and a boolean value to flip the card
  cards: [
    { cardName: "atom", matched: false, flip: false },
    { cardName: "frog", matched: false, flip: false },
    { cardName: "feather-alt", matched: false, flip: false },
    { cardName: "cogs", matched: true, flip: false },
    { cardName: "anchor", matched: false, flip: false },
    { cardName: "fan", matched: false, flip: false },
    { cardName: "bolt", matched: true, flip: false },
    { cardName: "hat-wizard", matched: false, flip: false },
    { cardName: "apple-alt", matched: false, flip: false },
    { cardName: "bell", matched: false, flip: false },
    { cardName: "bomb", matched: false, flip: false },
    { cardName: "brain", matched: false, flip: false },
  ],
  newGame: false,
  score: 0,
  nextCardArray: [],
  currentCard: 0,
  allowClick: true,
};

// global variable used to store the location of the card being clicked on
let foundCard;

//global variable used to point towards the next card array located in the game object
let nextCard;
//global variable used to point towards the current card number located in the game object
let currentCard;

//function used to reset the entire board
function reset() {
  //loops through the cards and sets the matched values and flip values to false
  for (let card of gameObject.cards) {
    card.matched = false;
    card.flip = false;
  }
  //sets the score to zero
  gameObject.score = 0;
  //sets new game to be true
  gameObject.newGame = true;
  //resets the current card to zero
  gameObject.currentCard = 0;

  //shuffles the cards on the board
  shuffleCards();
  //shuffles the next card array
  shuffleNextCard();

  //global variable used to point towards the next card array located in the game object
  nextCard = gameObject.nextCardArray;
  //global variable used to point towards the current card number located in the game object
  currentCard = gameObject.currentCard;

  //renders the board
  render();
  //sets new game to be false
  gameObject.newGame = false;
}

//function used to shuffle the cards on the board
function shuffleCards() {
  //defines array variable that points to the array of cards
  let array = gameObject.cards;
  //shuffles the array of cards
  array = shuffle(array);
}

//function used to shuffle the next card array
function shuffleNextCard() {
  //loops through the next card array and sets the value of each index to be equal to the array of cards used on the board
  for (let i = 0; i < gameObject.cards.length; i++) {
    gameObject.nextCardArray[i] = gameObject.cards[i].cardName;
  }
  //shuffles the next card array
  shuffle(gameObject.nextCardArray);
}

//function that runs when the user is allowed to click
function onClick(event) {
  //sets the user to not be allowed to click
  gameObject.allowClick = false;
  //sets a variable that points towards the card that was clicked on
  let card = event.target;

  //checks to see if the user clicked on a card
  if (card.className === "card") {
    //adds one to the score
    gameObject.score++;

    //finds the card that was clicked on in the game object
    findCard();

    //sets the card to flip
    foundCard.flip = true;
    //renders the flip
    renderCardFlips(event);
    //hides the card
    hideCard(event);
    //checks to see if the card matches the next card after the card is hidden
    setTimeout(checkForMatch, 500, event);
  } else {
    //if the user did not click on a card they are allowed to click again
    gameObject.allowClick = true;
  }
}
//function used to hide the card after a set time
function hideCard(event) {
  //sets the card to un-flip
  foundCard.flip = false;
  //renders the card after a set amount of time
  setTimeout(renderCardFlips, 500, event);
}

//function used to check to see if the card is a match
function checkForMatch(event) {
  //sets a variable that points towards the card that was clicked
  let card = event.target;
  //checks to see if the card's first child (i tag) has a class name that is identical to the name of the current next card
  if (card.children[0].className === `fas fa-${nextCard[currentCard]}`) {
    //sets the card to
    foundCard.matched = true;
    //renders the card
    matchedFunction(event);
    //updates the current card variable
    currentCard = gameObject.currentCard;
    //checks to see if all the cards have been matched
    checkForWinCondition(gameObject.cards);
    //renders the board
    render();
  }
  //allows the user to click again
  gameObject.allowClick = true;
}

//function used to render the matched card
function matchedFunction(event) {
  //sets the next card index to go up by one
  gameObject.currentCard++;
  //renders the board
  render();
  //renders the card
  renderCardFlips(event);
}

//checks to see if all cards have been matched
function checkForWinCondition(list) {
  //sets a variable to equal the operation on the list array. checks to see if all cards are matched. returns a boolean
  let winCheck = list.every((card) => card.matched === true);
  //checks to see if all cards equal true
  if (winCheck) {
    //sets timer to alert user to allow board to render final click
    setTimeout(winAlert, 100);
  }
}

//function used to alert the user that they have won
function winAlert() {
  //alerts the user that they have won and tells them how many moves it took using the game score
  alert(`You Won! It took ${gameObject.score} moves to get there`);
  //resets the board after the user has been alerted
  reset();
}

//function used to find the next card in the array of cards
function findCard() {
  //finds the card that is equal to the current card in the next card array
  foundCard = gameObject.cards.find(
    (card) => card.cardName === nextCard[currentCard]
  );
}

//function used to render the game
function render() {
  //sets variable to equal the list of cards
  let ul = document.querySelector("#cards");
  //sets variable to equal an individual card
  let li = ul.querySelectorAll(".card");
  //sets variable to equal the list of i tags in the list of cards
  let iList = ul.getElementsByClassName("fas");
  //sets variable to equal the next card slot
  let nextCardDiv = document.querySelector("#next-card");

  //sets the next card slot to equal to current card in the next card array
  nextCardDiv.children[0].className = `fas fas fa-${nextCard[currentCard]}`;

  //sets the score to equal the score stored in the object
  document.querySelector("#score").textContent = gameObject.score;

  //checks to see if new game is true
  if (gameObject.newGame === true) {
    //loops through each i tag and gives it a symbol and loops through each card and resets the classes
    for (let i = 0; i < gameObject.cards.length; i++) {
      //gives i tag a symbol
      iList[i].className = `fas fa-${gameObject.cards[i].cardName}`;
      //gives card default classes
      li[i].className = "card";
    }
  }
}

//renders the card flips
function renderCardFlips(event) {
  //sets variable to be the card that was clicked
  let card = event.target;
  //checks to see if the card has been flipped
  if (foundCard.flip) {
    //flips the car
    card.classList.add("show");
  } else {
    //un-flips the card
    card.classList.remove("show");
  }

  //checks to see if the card has been matched
  if (foundCard.matched) {
    //matches the card
    card.classList.add("matched");
  }
  //renders the board
  render();
}

//function that checks to see whether or not the user can click or not
function clickHandler(event) {
  //checks to see if the user can click
  if (gameObject.allowClick) {
    //runs click function
    onClick(event);
  } else {
    //stops user from being allowed to click
    event.preventDefault;
  }
}

//resets the board when the page has loaded
reset();

//alerts the user of what the game is
alert(
  "Welcome To The MITT Matching Game. Your Goal Is To Find The Matching Pair For Each Card, While Also Trying To Achieve The Lowest Possible Score. Good Luck!"
);

//listens for a click on the list of cards | runs the click handler function
document.querySelector("#cards").addEventListener("click", clickHandler);
//listens for a click on the restart button | runs the restart function
document.querySelector(".restart").addEventListener("click", reset);
