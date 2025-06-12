// script.js
// Beginner-friendly maze game logic for Clean Water Quest
// The player moves with arrow keys or on-screen buttons, and water decreases over time and with each move.

// --- Maze layout: 0 = empty, 1 = wall, 2 = home (goal) ---
const maze = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,1,0,0,1],
  [1,1,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,1,0,0,2,1],
  [1,1,1,1,1,1,1,1,1,1],
];

// Player starts at (1,1)
let player = { row: 1, col: 1 };
let steps = 0;
let water = 300; // max water
let timer = 60;
let interval;
let gameOver = false;

const board = document.getElementById('game-board');
const timerSpan = document.getElementById('timer');
const stepsSpan = document.getElementById('steps');
const scoreSpan = document.getElementById('score');
const messageDiv = document.getElementById('message');

// Create water bar
function createWaterBar() {
  const barContainer = document.createElement('div');
  barContainer.id = 'water-bar-container';
  const bar = document.createElement('div');
  bar.id = 'water-bar';
  barContainer.appendChild(bar);
  // Insert water bar before the game container for correct layout
  const gameContainer = document.getElementById('game-container');
  document.body.insertBefore(barContainer, gameContainer);
}

// Create arrow keys UI
function createArrowKeys() {
  const container = document.createElement('div');
  container.id = 'arrow-keys';
  container.innerHTML = `
    <div class="arrow-row">
      <button class="arrow-btn" data-dir="up">⬆️</button>
    </div>
    <div class="arrow-row">
      <button class="arrow-btn" data-dir="left">⬅️</button>
      <button class="arrow-btn" data-dir="down">⬇️</button>
      <button class="arrow-btn" data-dir="right">➡️</button>
    </div>
  `;
  board.parentNode.insertBefore(container, board.nextSibling);
  // Add click listeners
  container.querySelectorAll('.arrow-btn').forEach(btn => {
    btn.addEventListener('click', () => movePlayer(btn.dataset.dir));
  });
}

// Draw the maze
function drawMaze() {
  // Check if board exists
  if (!board) {
    alert('Game board not found!');
    return;
  }
  console.log('board:', board);
  console.log('maze:', maze);
  console.log('drawMaze called');
  board.innerHTML = '';
  board.style.display = 'grid';
  board.style.gridTemplateColumns = `repeat(${maze[0].length}, 60px)`;
  board.style.gridTemplateRows = `repeat(${maze.length}, 60px)`;
  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[0].length; c++) {
      const cell = document.createElement('div');
      cell.className = 'tile';
      cell.style.width = '60px';
      cell.style.height = '60px';
      cell.style.fontSize = '36px';
      cell.style.border = '2px solid #81d4fa';
      if (maze[r][c] === 1) {
        cell.classList.add('wall');
        cell.innerHTML = '';
      } else if (maze[r][c] === 2) {
        cell.classList.add('goal');
        cell.innerHTML = '🏠';
      } else if (r === player.row && c === player.col) {
        cell.classList.add('player');
        cell.innerHTML = '🧑💧';
      } else {
        cell.innerHTML = '';
      }
      board.appendChild(cell);
    }
  }
}

// Move player
function movePlayer(dir) {
  if (gameOver) return;
  let { row, col } = player;
  if (dir === 'up') row--;
  if (dir === 'down') row++;
  if (dir === 'left') col--;
  if (dir === 'right') col++;
  // Check bounds and walls
  if (maze[row] && maze[row][col] !== 1) {
    player.row = row;
    player.col = col;
    steps++;
    stepsSpan.textContent = steps;
    water -= 5; // Lose water per move
    updateWaterBar();
    drawMaze();
    checkGoal();
  }
}

// Keyboard controls
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') movePlayer('up');
  if (e.key === 'ArrowDown') movePlayer('down');
  if (e.key === 'ArrowLeft') movePlayer('left');
  if (e.key === 'ArrowRight') movePlayer('right');
});

// Water bar update
function updateWaterBar() {
  const bar = document.getElementById('water-bar');
  bar.style.width = Math.max(0, (water/300)*100) + '%';
  scoreSpan.textContent = water;
  if (water <= 0) endGame(false);
}

// Timer
function startTimer() {
  interval = setInterval(() => {
    if (gameOver) return;
    timer--;
    timerSpan.textContent = timer;
    water -= 2; // Lose water over time
    updateWaterBar();
    if (timer <= 0) endGame(false);
  }, 1000);
}

// Check if player reached home
function checkGoal() {
  if (maze[player.row][player.col] === 2) {
    endGame(true);
  }
}

// End game
function endGame(win) {
  gameOver = true;
  clearInterval(interval);
  if (win) {
    // Create a popup overlay for the win message
    const popup = document.createElement('div');
    popup.id = 'win-popup';
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100vw';
    popup.style.height = '100vh';
    popup.style.background = 'rgba(0, 170, 255, 0.15)';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.alignItems = 'center';
    popup.style.justifyContent = 'center';
    popup.style.zIndex = '1000';

    const box = document.createElement('div');
    box.style.background = '#fff';
    box.style.padding = '36px 32px';
    box.style.borderRadius = '18px';
    box.style.boxShadow = '0 6px 32px rgba(0,170,255,0.18)';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.alignItems = 'center';

    const msg = document.createElement('div');
    msg.style.fontSize = '1.5em';
    msg.style.color = '#00aaff';
    msg.style.marginBottom = '18px';
    msg.style.fontWeight = 'bold';
    msg.textContent = `🎉 You made it home with ${water} water left!`;
    box.appendChild(msg);

    const playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = 'Play Again';
    playAgainBtn.style.background = '#00aaff';
    playAgainBtn.style.color = '#fff';
    playAgainBtn.style.fontSize = '1.1em';
    playAgainBtn.style.padding = '10px 32px';
    playAgainBtn.style.border = 'none';
    playAgainBtn.style.borderRadius = '8px';
    playAgainBtn.style.marginBottom = '16px';
    playAgainBtn.style.cursor = 'pointer';
    playAgainBtn.style.fontWeight = '600';
    playAgainBtn.addEventListener('click', function() {
      document.body.removeChild(popup);
      // Reset game
      const resetBtn = document.getElementById('reset-btn');
      if (resetBtn) resetBtn.click();
    });
    box.appendChild(playAgainBtn);

    const learnMore = document.createElement('a');
    learnMore.textContent = 'Learn more about charity: water';
    learnMore.href = 'https://www.charitywater.org/';
    learnMore.target = '_blank';
    learnMore.style.display = 'inline-block';
    learnMore.style.marginTop = '6px';
    learnMore.style.color = '#0077b6';
    learnMore.style.fontWeight = '500';
    learnMore.style.textDecoration = 'underline';
    box.appendChild(learnMore);

    popup.appendChild(box);
    document.body.appendChild(popup);
  } else {
    messageDiv.textContent = '💧 You ran out of water or time! Try again!';
  }
}

// --- Initialize game ---
document.addEventListener('DOMContentLoaded', function() {
  const gameContainer = document.getElementById('game-container');
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const quitBtn = document.getElementById('quit-btn');
  const messageDiv = document.getElementById('message');
  let waterBarCreated = false;
  let arrowKeysCreated = false;

  function startGame() {
    startBtn.style.display = 'none';
    gameContainer.style.display = 'flex';
    messageDiv.textContent = '';
    // Only create water bar and arrow keys once
    if (!waterBarCreated) { createWaterBar(); waterBarCreated = true; }
    if (!arrowKeysCreated) { createArrowKeys(); arrowKeysCreated = true; }
    resetGameState();
    drawMaze();
    updateWaterBar();
    startTimer();
  }

  function resetGameState() {
    // Reset all game state variables
    player = { row: 1, col: 1 };
    steps = 0;
    water = 300;
    timer = 60;
    gameOver = false;
    stepsSpan.textContent = steps;
    timerSpan.textContent = timer;
    scoreSpan.textContent = water;
    messageDiv.textContent = '';
    clearInterval(interval);
  }

  if (startBtn) {
    startBtn.addEventListener('click', startGame);
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      resetGameState();
      drawMaze();
      updateWaterBar();
      startTimer();
    });
  }
  if (quitBtn) {
    quitBtn.addEventListener('click', function() {
      gameContainer.style.display = 'none';
      startBtn.style.display = 'inline-block';
      messageDiv.textContent = 'Game quit. Click Start Game to play again!';
      clearInterval(interval);
    });
  }
});
