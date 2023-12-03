const cards = document.querySelectorAll('.cards');

let FlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return; //wait for the first set of cards to finish
  if (this === firstCard) return; //to remove the is matched function when double clicked

  this.classList.add('flip'); //flip sound for first & second card
  playFlipSound();
  
  //flip first card
  if (!FlippedCard) {
    FlippedCard = true;
    firstCard = this;
    return;
  }
  
  //flip second card
  secondCard = this;
  checkForMatch();
}

//check for matched cards
function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

//ask if the cards matched
  //ternary operator: (condition? true : false)
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
     //if the cards matched remove eventlistener
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  if (document.querySelectorAll('.flip').length === cards.length) {
    // All cards are flipped, display "You Win" popup
    showYouWinPopup();
    playVictorySound();
  }

  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  //unflipped the cards 
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    playFlipSound();

    resetBoard();
  }, 500); //set delay to see the other card flip
}

function resetBoard() { //reset board to return the first card
  [FlippedCard, lockBoard] = [false, false]; //lock the cards in place befoer flipping another
  [firstCard, secondCard] = [null, null];
}

function showYouWinPopup() {
  document.getElementById('victory-text').classList.add('visible');
}

function restartGame() {
  document.getElementById('victory-text').classList.remove('visible');

  // Reset all cards to their initial order
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12); //generate a random number to assign each of the card
    card.style.order = randomPos;
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });
}

function playFlipSound() { //flip sound
  let flipSound = new Audio('audio/flipCard.wav');
  flipSound.play();
}

function playVictorySound() { //victory sound
  let victorySound = new Audio('audio/success.wav');
  audioController.stopMusic(); 
  victorySound.play();
}

function playBackgroundMusic() { //background music
  audioController.startMusic();
}

cards.forEach(card => card.addEventListener('click', flipCard)); //eventlistener for when the card is clicked, it will flip

function ready() { //Opening: CLICK TO START 
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));

  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => { //click to start the game
      overlay.classList.remove('visible'); // remove the visibility of the overlay and start the game
      restartGame();
      playBackgroundMusic(); //Call out function for the bgMusic
    });
  });
}

class AudioController { //Audio Control for the bgMusic
  constructor() {
    this.bgMusic = new Audio('audio/Opening.mp3');
    this.bgMusic.volume = 0.7;
  }

  startMusic() { //starts the audio/music
    this.bgMusic.play();
  }
  stopMusic(){  //stops the audio/music
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0; //set time for the bgMusic to start
  }
}

let audioController = new AudioController(); //to take all audio and call each of the audio

if (document.readyState === 'loading') { //this function is when the html is finished loading called this condition (ready)
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}
