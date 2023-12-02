const cards = document.querySelectorAll('.cards');

let FlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');
  playFlipSound();

  if (!FlippedCard) {
    FlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
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

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    playFlipSound();

    resetBoard();
  }, 500);
}

function resetBoard() {
  [FlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function showYouWinPopup() {
  document.getElementById('victory-text').classList.add('visible');
}

function restartGame() {
  document.getElementById('victory-text').classList.remove('visible');

  // Reset all cards to their initial order
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });
}

function playFlipSound() {
  let flipSound = new Audio('audio/flipCard.wav');
  flipSound.play();
}

function playVictorySound() {
  let victorySound = new Audio('audio/success.wav');
  audioController.stopMusic(); 
  victorySound.play();
}

function playBackgroundMusic() {
  audioController.startMusic();
}

cards.forEach(card => card.addEventListener('click', flipCard));

function ready() { //Opening / CLICK TO START
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));

  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
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

  startMusic() {
    this.bgMusic.play();
  }
  stopMusic(){
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
}

let audioController = new AudioController();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}
