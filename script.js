let firstCard = null; // Variable to hold the first selected card
let secondCard = null; // Variable to hold the second selected card
let lockBoard = false; // Variable to prevent clicking when cards are being compared
let attempts = 15; // Variable to track remaining attempts
let matches = 0; // Variable to track number of matches found

const cards = document.querySelectorAll('.card'); // Select all card elements
const attemptsSpan = document.querySelector('.score__attempts .number'); // Select the attempts display element
const matchesSpan = document.querySelector('.score__pairs .number'); // Select the matches display element
const overlay = document.getElementById("overlay");//select the loose/win overlay
const modal = document.getElementById("modal");//select the modal to change name
const resultText = document.getElementById("resultText");//select the text of win or loose

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
    setTimeout(checkForMatch, 900);
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

// Check if the two selected cards match
function checkForMatch() {
    // Compare the data-value attributes of the two cards
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        disableCards(); // Disable if they match and keep them flipped
        matches++; // Increment matches
        checkWin(); // Check if the player has won
    } else {
        unflipCards(); // Unflip if they don't match
        attempts--; // Decrement attempts
        checkLose(); // Check if the player has lost
    }

    updateUI(); // Update the UI with new attempts and matches
    resetBoardState(); // Reset the board state for the next turn
}

// This will be called in the checkForMatch function if the player finds a match
function disableCards() {
    firstCard.classList.add('is-matched');
    secondCard.classList.add('is-matched');
    firstCard.style.pointerEvents = 'none';
    secondCard.style.pointerEvents = 'none';
}

//make apear and change the overlay

function showWin() {
    overlay.style.display = "flex";
    modal.className = "modal win";
    resultText.textContent = "You Win";
}

function showLose() {
    overlay.style.display = "flex";
    modal.className = "modal lose";
    resultText.textContent = "You Lose";
}

// Check if the player has won
function checkWin() {
    if (matches === 9) {
      showWin()
        console.log('You won! :)'); // You can replace this with an overlay or any other UI element
    }
}

// Check if the player has lost
function checkLose() {
    if (attempts === 0) {
      showLose()
        console.log('Game over :('); // You can replace this with an overlay or any other UI element
    }
}

document.addEventListener('DOMContentLoaded', initGame);


/* --------------------------------------------------------
    NOTAS
----------------------------------------------------------- */

/*  Cada carta tiene un atributo data-value que se usa para comparar si dos cartas son iguales. Estos data-values son los nombres de los países
    Los decoys NO tienen data-value definido. Por lo que si se selecciona un decoy, su data-value será 'undefined'. Por eso por ahora si se 
    seleccionan dos decoys, el juego los considera iguales (undefined === undefined). 

    Eso es temporal hasta que se implemente la lógica de los decoys.
*/

/*  CREO que la función checkLose() es para mostrar el overlay cuando se pierde. Por ahora tiene solo un console.log.
    Cuando vayas a implementar ese overlay, verifica si tienes que utilizar esa función y poner tu código ahí dentro, o si tienes que 
    crear una nueva función.
*/

/*  Hasta el momento el juego tiene las siguientes funcionalidades:
    - Baraja las cartas al iniciar - Usa order y mezcla aleatoria
    - Permite voltear cartas al hacer click - Con animación CSS 3D
    - Compara dos cartas seleccionadas - Basado en data-value
    - Lleva conteo de intentos y pares - Actualiza en tiempo real
    - Mensaje en consola al perder - Cuando attempts === 0
    - Bloquea el tablero durante comparación - lockBoard = true
    - Previene clicks en cartas ya volteadas - Verifica is-flipped
    - Mantiene cartas acertadas visibles - No se desvoltean
    - Deshabilita cartas emparejadas - No se pueden volver a clickear
    - Verifica victoria - Cuando matches === 7 (consola)
    - Prepara siguiente turno automáticamente - resetBoardState()
*/

// Puedes borrar toda esta sección de notas cuando ya no la necesites.