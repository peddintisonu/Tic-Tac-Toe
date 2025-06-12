// author: Siva Peddinti

// Get all the HTML elements we need to work with
const allCells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");
const restartBtn = document.getElementById("restartButton");
const friendBtn = document.getElementById("friendBtn");
const botBtn = document.getElementById("botBtn");
const changeModeBtn = document.getElementById("changeModeBtn");
const startGameBtn = document.getElementById("startGameBtn");
const gameModeSelector = document.querySelector(".game-mode-selector");
const nameInputArea = document.getElementById("nameInputArea");
const player2InputDiv = document.getElementById("player2InputDiv");
const gameArea = document.getElementById("gameArea");
const player1NameInput = document.getElementById("player1Name");
const player2NameInput = document.getElementById("player2Name");

// All the possible ways to win the game
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Variables to keep track of the game's state
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameRunning = false;
let isVsBot = false;
let player1Name = "Player 1";
let player2Name = "Player 2";

// --- Game Setup ---
friendBtn.addEventListener("click", () => {
  isVsBot = false;
  gameModeSelector.classList.add("hidden");
  player2InputDiv.classList.remove("hidden");
  nameInputArea.classList.remove("hidden");
});

botBtn.addEventListener("click", () => {
  isVsBot = true;
  gameModeSelector.classList.add("hidden");
  player2InputDiv.classList.add("hidden");
  nameInputArea.classList.remove("hidden");
});

startGameBtn.addEventListener("click", () => {
  player1Name = player1NameInput.value || "Player 1 (X)";
  if (isVsBot) {
    player2Name = "Bot (O)";
  } else {
    player2Name = player2NameInput.value || "Player 2 (O)";
  }
  nameInputArea.classList.add("hidden");
  gameArea.classList.remove("hidden");
  initializeGame();
});

// --- Main Game Logic ---
function initializeGame() {
  isGameRunning = true;
  allCells.forEach((cell) => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  changeModeBtn.addEventListener("click", returnToMenu);
  updateStatusText();
}

function cellClicked() {
  const cellIndex = this.getAttribute("data-index");
  if (options[cellIndex] != "" || !isGameRunning) {
    return;
  }
  updateCell(this, cellIndex);
  checkWinner();
  if (isVsBot && isGameRunning && currentPlayer === "O") {
    setTimeout(botMove, 500);
  }
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  const icon = document.createElement("i");
  if (currentPlayer === "X") {
    icon.className = "fas fa-times";
  } else {
    icon.className = "fa-regular fa-circle";
  }
  cell.appendChild(icon);
  changePlayer();
}

function changePlayer() {
  currentPlayer = currentPlayer == "X" ? "O" : "X";
  if (isGameRunning) {
    updateStatusText();
  }
}

function updateStatusText() {
  const currentName = currentPlayer === "X" ? player1Name : player2Name;
  statusText.textContent = `${currentName}'s turn`;
}

function botMove() {
  let emptyCells = [];
  for (let i = 0; i < options.length; i++) {
    if (options[i] === "") {
      emptyCells.push(i);
    }
  }
  if (emptyCells.length > 0 && isGameRunning) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const botCellIndex = emptyCells[randomIndex];
    const cellToUpdate = document.querySelector(
      `.cell[data-index='${botCellIndex}']`
    );
    updateCell(cellToUpdate, botCellIndex);
    checkWinner();
  }
}

// Checks for a winner and highlights the winning squares
function checkWinner() {
  let roundWon = false;
  let winningCondition;

  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if (cellA == "" || cellB == "" || cellC == "") {
      continue;
    }
    if (cellA == cellB && cellB == cellC) {
      roundWon = true;
      winningCondition = condition; // Store the winning line
      break;
    }
  }

  if (roundWon) {
    const winnerSymbol = currentPlayer == "X" ? "O" : "X";
    const winnerName = winnerSymbol === "X" ? player1Name : player2Name;
    statusText.textContent = `${winnerName} wins!`;
    isGameRunning = false;
    highlightWinner(winningCondition); // NEW: Highlight the cells
  } else if (!options.includes("")) {
    statusText.textContent = `It's a draw!`;
    isGameRunning = false;
  }
}

// NEW: This function adds the highlight class to the winning cells
function highlightWinner(condition) {
  condition.forEach((index) => {
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    cell.classList.add("winning-cell");
  });
}

// --- Menu and Reset Functions ---
function restartGame() {
  options = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameRunning = true;
  updateStatusText();
  allCells.forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("winning-cell"); // UPDATED: Remove highlight on restart
  });
}

function returnToMenu() {
  restartGame();
  player1NameInput.value = "";
  player2NameInput.value = "";
  gameArea.classList.add("hidden");
  gameModeSelector.classList.remove("hidden");
}
