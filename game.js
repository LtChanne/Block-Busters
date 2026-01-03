// Grid setup
const gridSize = 9;
const gridEl = document.getElementById("grid");
let grid = [];

// Score and level
let score = 0;
let level = 1;
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");

// Blocks container
const blocksContainer = document.getElementById("blocks-container");

// Restart button
const restartBtn = document.getElementById("restart");
restartBtn.onclick = () => location.reload();

// Initialize grid
function createGrid() {
  grid = [];
  gridEl.innerHTML = '';
  for (let r = 0; r < gridSize; r++) {
    let row = [];
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      gridEl.appendChild(cell);
      row.push(cell);
    }
    grid.push(row);
  }
}

// Block shapes
const shapes = [
  [[1,1,1],[0,0,0],[0,0,0]], // horizontal 3
  [[1],[1],[1]],             // vertical 3
  [[1,1],[1,1]],             // square 2x2
  [[1,0],[1,1]],             // L-shape
  [[0,1],[1,1]]              // reverse L
];

// Generate blocks
function generateBlocks() {
  blocksContainer.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const blockEl = document.createElement("div");
    blockEl.classList.add("block");
    
    shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        const cellEl = document.createElement("div");
        cellEl.classList.add("block-cell");
        if (cell) cellEl.classList.add("filled");
        blockEl.appendChild(cellEl);
      });
    });

    // Click to place block
    blockEl.onclick = () => placeBlock(shape);
    blocksContainer.appendChild(blockEl);
  }
}

// Place block
function placeBlock(shape) {
  outer:
  for (let r = 0; r <= gridSize - shape.length; r++) {
    for (let c = 0; c <= gridSize - shape[0].length; c++) {
      if (canPlace(shape, r, c)) {
        for (let i = 0; i < shape.length; i++) {
          for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) grid[r+i][c+j].classList.add("filled");
          }
        }
        updateScore(10);
        generateBlocks();
        checkLines();
        return;
      }
    }
  }
  alert("No space for this block!");
}

// Can place block?
function canPlace(shape, row, col) {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] && grid[row+i][col+j].classList.contains("filled")) {
        return false;
      }
    }
  }
  return true;
}

// Check full rows & columns
function checkLines() {
  for (let r = 0; r < gridSize; r++) {
    if (grid[r].every(cell => cell.classList.contains("filled"))) {
      grid[r].forEach(cell => cell.classList.remove("filled"));
      updateScore(50);
    }
  }
  for (let c = 0; c < gridSize; c++) {
    let full = true;
    for (let r = 0; r < gridSize; r++) {
      if (!grid[r][c].classList.contains("filled")) full = false;
    }
    if (full) {
      for (let r = 0; r < gridSize; r++) grid[r][c].classList.remove("filled");
      updateScore(50);
    }
  }
}

// Update score & level
function updateScore(points) {
  score += points;
  scoreEl.textContent = `Score: ${score}`;
  level = Math.floor(score / 200) + 1;
  levelEl.textContent = `Level: ${level}`;
}

// Init game
createGrid();
generateBlocks();
