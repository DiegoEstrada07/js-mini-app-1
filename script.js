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
const flagImages = [
    "./assets/images/argentina.webp",
    "./assets/images/brasil.webp",
    "./assets/images/colombia.webp",
    "./assets/images/corea.webp",
    "./assets/images/mexico.webp",
    "./assets/images/peru.webp",
    "./assets/images/republica-checa.webp"
];//images

function startApp() {
    document.getElementById("startOverlay").style.display = "none";// change the start overlay display to "none"
    unlockGameBoard(); // <-- AÑADIR ESTA LÍNEA
}


// Función para cambiar las imágenes aleatoriamente
function assignRandomFlagToDecoy(decoyCard) {
    let randomIndex;
    let lastFlagIndex = decoyCard.dataset.lastFlagIndex;
    
    // If there's a last flag, try to avoid repeating it
    if (lastFlagIndex !== undefined) {
        // Generate a new random index different from the last one
        do {
            randomIndex = Math.floor(Math.random() * flagImages.length);
        } while (randomIndex === parseInt(lastFlagIndex) && flagImages.length > 1);
    } else {
        randomIndex = Math.floor(Math.random() * flagImages.length);
    }
    
    const imgElement = decoyCard.querySelector('.card__front img');
    imgElement.src = flagImages[randomIndex];
    
    // Also assign a temporary data-value for this turn
    const countryNames = ["argentina", "brasil", "colombia", "corea", "mexico", "peru", "czech"];
    decoyCard.dataset.tempValue = countryNames[randomIndex];
    
    // Store the last flag index to avoid immediate repeats
    decoyCard.dataset.lastFlagIndex = randomIndex;
}

// Función para inicializar todos los decoys
function initializeDecoys() {
    const decoyCards = document.querySelectorAll('.card[data-type="decoy"]');
    decoyCards.forEach(decoyCard => {
        assignRandomFlagToDecoy(decoyCard);
    });
}

function initGame() {
    shuffleBoard(); // Shuffle the cards on the board
    updateUI(); // Update the attempts and matches trackers
    resetBoardState(); // Reset some variables to initial state
    addCardListeners();
    initializeDecoys();
    lockGameBoard(); // <-- AÑADIR ESTA LÍNEA
}

//change flags
// const divs = document.querySelectorAll('.card__front img');




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
    setTimeout(checkForMatch, 600);
}

// Flip the card by adding the 'is-flipped' class
function flipCard(card) {
    card.classList.add('is-flipped');
    
    // If it's a decoy, assign a RANDOM flag EVERY TIME and add decoy class
    if (card.dataset.type === "decoy") {
        assignRandomFlagToDecoy(card);
        card.classList.add('decoy'); // Add visual indicator
    }
}


// Unflip the cards by removing the 'is-flipped' class
function unflipCards() {
    firstCard.classList.remove('is-flipped');
    secondCard.classList.remove('is-flipped');
}

// Check if the two selected cards match
function checkForMatch() {

    let isMatch;

    // Compare the data-type attributes of the two cards, to check if any of them is a decoy
    const isFirstDecoy = firstCard.dataset.type === "decoy";
    const isSecondDecoy = secondCard.dataset.type === "decoy";

    // RULES: 
    // 1. If both are decoys -> no match
    // 2. If one is a decoy -> no match
    // 3. If none are decoys -> compare data-value attributes

    if (isFirstDecoy && isSecondDecoy) {
        isMatch = false;
    }
    else if (isFirstDecoy || isSecondDecoy) {
        isMatch = false;

        if (isFirstDecoy) {
            firstCard.dataset.tempValue = undefined; // Limpiar valor temporal
        }
        if (isSecondDecoy) {
            secondCard.dataset.tempValue = undefined;
        }
    }
    else {
        isMatch = firstCard.dataset.value === secondCard.dataset.value;
    }
    // ----------------------------------------------------------------------------------------


    if (isMatch) {
        disableCards(); // Disable if they match and keep them flipped
        matches++; // Increment matches
        checkWin(); // Check if the player has won
        right();
    } else {
        firstCard.classList.add('shake', 'error');
        secondCard.classList.add('shake', 'error');

        unflipCards(); // Unflip if they don't match
        attempts--; // Decrement attempts
        checkLose(); // Check if the player has lost
        cambiarBorde(); //change game--board background to red

        // Remover clases de error después de la animación
        setTimeout(() => {
            firstCard.classList.remove('shake', 'error');
            secondCard.classList.remove('shake', 'error');
            
            firstCard.classList.remove('decoy');
            secondCard.classList.remove('decoy');
        }, 500);
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

//create a red border every timeyou miss an atemmpt
function cambiarBorde() {
    const gameBoard = document.querySelector('.game__board');
    gameBoard.style.backgroundColor = "#ff00005d";

    setTimeout(() => {
        gameBoard.style.backgroundColor = "#ff000000";
    }, 500); // 1 segundo
}

//create a green background when you get it right
function right() {
    const gameBoard = document.querySelector('.game__board');
    gameBoard.style.backgroundColor = "#04ff005f";

    setTimeout(() => {
        gameBoard.style.backgroundColor = "#ff000000";
    }, 500); // 1 segundo
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

//actives each time the attempts reduces

// Check if the player has won
function checkWin() {
    if (matches === 7) {
        showWin();
        lockGameBoard(); // <-- AÑADIR ESTA LÍNEA
        console.log('You won! :)');
    }
}

// Check if the player has lost
function checkLose() {
    if (attempts === 0) {
        showLose();
        showAllCards(); // <-- AÑADIR ESTA LÍNEA
        lockGameBoard(); // <-- AÑADIR ESTA LÍNEA
        console.log('Game over :(');
    }
}

// ==========================================================================
// COMPLETE GAME RESET FUNCTION
// ==========================================================================

function resetGame() {
    console.log("Resetting game...");
    
    // 1. RESET GAME STATE VARIABLES
    attempts = 15;
    matches = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    
    // 2. RESET UI DISPLAYS
    updateUI();
    
    // 3. RESET ALL CARDS
    cards.forEach(card => {
        // Remove all visual states
        card.classList.remove('is-flipped', 'is-matched', 'shake', 'error', 'decoy');
        
        // Re-enable pointer events (cards are clickable again)
        card.style.pointerEvents = "auto";
        
        // Clear any inline styles
        card.style.order = "";
        
        // Special handling for decoy cards
        if (card.dataset.type === "decoy") {
            const imgElement = card.querySelector('.card__front img');
            imgElement.src = ""; // Clear the image
            delete card.dataset.tempValue; // Remove temporary data
            delete card.dataset.lastFlagIndex; // Remove last flag index
        }
    });
    
    // 4. SHUFFLE THE BOARD AGAIN
    shuffleBoard();
    
    // 5. INITIALIZE DECOYS WITH NEW RANDOM FLAGS
    initializeDecoys();
    
    // 6. HIDE WIN/LOSE OVERLAY
    overlay.style.display = "none";
    
    // 7. SHOW START OVERLAY AND LOCK BOARD
    startOverlay.style.display = "flex";
    lockGameBoard();
    
    console.log("Game reset complete!");
}

// ==========================================================================
// GAME BOARD LOCK/UNLOCK FUNCTIONS
// ==========================================================================

function lockGameBoard() {
    const gameBoard = document.querySelector('.game__board');
    gameBoard.style.pointerEvents = "none";
}

function unlockGameBoard() {
    const gameBoard = document.querySelector('.game__board');
    gameBoard.style.pointerEvents = "auto";
}

// ==========================================================================
// SHOW ALL CARDS WHEN LOSING
// ==========================================================================

function showAllCards() {
    cards.forEach(card => {
        if (!card.classList.contains('is-flipped')) {
            card.classList.add('is-flipped');
            // If it's a decoy, assign a random flag
            if (card.dataset.type === "decoy") {
                assignRandomFlagToDecoy(card);
            }
        }
    });
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