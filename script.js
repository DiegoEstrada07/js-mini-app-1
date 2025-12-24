let firstCard = null; // Variable to hold the first selected card
let secondCard = null; // Variable to hold the second selected card
let lockBoard = false; // Variable to prevent clicking when cards are being compared
let attempts = 15; // Variable to track remaining attempts
let matches = 0; // Variable to track number of matches found

const cards = document.querySelectorAll('.card'); // Select all card elements
const attemptsSpan = document.querySelector('.score__attempts .number'); // Select the attempts display element
const matchesSpan = document.querySelector('.score__pairs .number'); // Select the matches display element

function initGame() {
    shuffleBoard(); // Shuffle the cards on the board
    updateUI(); // Update the attempts and matches trackers
    resetBoardState(); // Reset every variable to initial state
    addCardListeners(); 
}

function shuffleBoard() {
    cards.forEach(card => {
        const randomOrder = Math.floor(Math.random() * cards.length);
        card.style.order = randomOrder;
    });
}