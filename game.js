// ===== BLOCK GAME LOGIC =====
const gridSize=9;
const gridEl=document.getElementById("grid");
let grid=[];

let score=0, level=1, stars=0;
const scoreEl=document.getElementById("score");
const levelEl=document.getElementById("level");
const starsEl=document.getElementById("stars");

const blocksContainer=document.getElementById("blocks-container");

document.getElementById("restart").onclick=()=>location.reload();

function createGrid(){
  grid=[]; gridEl.innerHTML='';
  for(let r=0;r<gridSize;r++){
    let row=[];
    for(let c=0;c<gridSize;c++){
      const cell=document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row=r;
      cell.dataset.col=c;
      cell.addEventListener("dragover", dragOverCell);
      cell.addEventListener("drop", dropOnCell);
      gridEl.appendChild(cell);
      row.push(cell);
    }
    grid.push(row);
  }
}

const shapes=[
  [[1,1,1],[0,0,0],[0,0,0]],
  [[1],[1],[1]],
  [[1,1],[1,1]],
  [[1,0],[1,1]],
  [[0,1],[1,1]]
];

let draggingBlock=null;
let draggingShape=null;

function generateBlocks(){
  blocksContainer.innerHTML='';
  for(let i=0;i<3;i++){
    const shape=shapes[Math.floor(Math.random()*shapes.length)];
    const blockEl=document.createElement("div");
    blockEl.classList.add("block");
    blockEl.setAttribute("draggable",true);

    shape.forEach(row=>row.forEach(cell=>{
      const cellEl=document.createElement("div");
      cellEl.classList.add("block-cell");
      if(cell)cellEl.classList.add("filled");
      blockEl.appendChild(cellEl);
    }));

    blockEl.addEventListener("dragstart",()=>{
      draggingBlock=blockEl;
      draggingShape=shape;
      blockEl.classList.add("dragging");
    });
    blockEl.addEventListener("dragend",()=>{
      draggingBlock=null; draggingShape=null;
      blockEl.classList.remove("dragging");
    });
    blocksContainer.appendChild(blockEl);
  }
}

function dragOverCell(e){ e.preventDefault();
  const row=parseInt(this.dataset.row);
  const col=parseInt(this.dataset.col);
  grid.flat().forEach(cell=>cell.classList.remove("highlight"));
  if(canPlace(draggingShape,row,col)) highlightCells(draggingShape,row,col);
}

function dropOnCell(e){
  const row=parseInt(this.dataset.row);
  const col=parseInt(this.dataset.col);
  if(!draggingShape) return;
  if(canPlace(draggingShape,row,col)){
    placeBlock(draggingShape,row,col);
    updateScore(10);
    generateBlocks();
    checkLines();
  } else alert("Cannot place here!");
  grid.flat().forEach(cell=>cell.classList.remove("highlight"));
}

function canPlace(shape,row,col){
  for(let i=0;i<shape.length;i++){
    for(let j=0;j<shape[i].length;j++){
      if(shape[i][j]){
        if(row+i>=gridSize||col+j>=gridSize)return false;
        if(grid[row+i][col+j].classList.contains("filled"))return false;
      }
    }
  } return true;
}

function highlightCells(shape,row,col){
  for(let i=0;i<shape.length;i++){
    for(let j=0;j<shape[i].length;j++){
      if(shape[i][j])grid[row+i][col+j].classList.add("highlight");
    }
  }
}

function placeBlock(shape,row,col){
  for(let i=0;i<shape.length;i++){
    for(let j=0;j<shape[i].length;j++){
      if(shape[i][j])grid[row+i][col+j].classList.add("filled");
    }
  }
}

function checkLines(){
  let linesCleared=0;
  for(let r=0;r<gridSize;r++){
    if(grid[r].every(cell=>cell.classList.contains("filled"))){
      grid[r].forEach(cell=>cell.classList.remove("filled"));
      linesCleared++;
    }
  }
  for(let c=0;c<gridSize;c++){
    let full=true;
    for(let r=0;r<gridSize;r++) if(!grid[r][c].classList.contains("filled")) full=false;
    if(full){ for(let r=0;r<gridSize;r++) grid[r][c].classList.remove("filled"); linesCleared++; }
  }
  if(linesCleared>0){
    updateScore(50*linesCleared);
    stars+=linesCleared;
    starsEl.textContent=`Stars: ${stars}`;
  }
}

function updateScore(points){
  score+=points;
  scoreEl.textContent=`Score: ${score}`;
  level=Math.floor(score/200)+1;
  levelEl.textContent=`Level: ${level}`;
}

createGrid();
generateBlocks();
