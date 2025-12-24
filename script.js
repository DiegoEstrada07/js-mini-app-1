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
    resetBoardState(); // Reset some variables to initial state
    addCardListeners(); 
}

// Shuffle the cards on the board
function shuffleBoard() {
    cards.forEach(card => {
        const randomOrder = Math.floor(Math.random() * cards.length);
        card.style.order = randomOrder;
    });
}

// Update the attempts and matches trackers in the UI
function updateUI() {
    attemptsSpan.textContent = attempts;
    matchesSpan.textContent = matches;
}

// Reset some variables to initial state for every new turn
function resetBoardState() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// Add click event listeners to all cards
function addCardListeners() {
    cards.forEach(card => {
        card.addEventListener('click', handleCardClick);
    });
}

function handleCardClick() {
    if (lockBoard) return; // Prevent clicking when the board is locked
    if (this.classList.contains('is-flipped')) return; // Prevent double clicking the same card if it's already flipped

    flipCard(this); // Call another function called flipCard, which adds the 'is-flipped' class to the clicked card

    // If firstCard is null, set it to the clicked card and return
    if (!firstCard) {
        firstCard = this;
        return;
    }

    // Set the secondCard to the clicked card and lock the board
    secondCard = this;
    lockBoard = true; // Lock the board until cards are compared

    // Wait 1 second
    setTimeout(checkForMatch, 1000)
}

// Flip the card by adding the 'is-flipped' class
function flipCard(card) {
    card.classList.add('is-flipped');
}

// Unflip the cards by removing the 'is-flipped' class
function unflipCards() {
    firstCard.classList.remove('is-flipped');
    secondCard.classList.remove('is-flipped');
}

