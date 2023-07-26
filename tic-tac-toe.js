let gameBoard;
let gameWon;
let currentPlayer;

document.querySelector('.js-start-button')
  .addEventListener('click', game)

function game(){
  gameWon = false;
  resetBoard();
  renderBoard();

  renderTurnText(pickFirstPlayer());  
}

function pickFirstPlayer(){
  let random = Math.random();
  if(random < 0.5) {
    return 'X';
  } else {
    return 'O';
  }
}

function renderTurnText(player){
  currentPlayer = player;
  if(gameWon){
    document.querySelector('.js-turn-text')
      .innerHTML = `Player ${currentPlayer} Won`;
  } else {
    document.querySelector('.js-turn-text')
      .innerHTML = `Player ${currentPlayer} turn`;
  }
}

function choice(index){
  gameBoard[index] = currentPlayer;
  console.log(index);
  console.log(gameBoard);
  checkWin();
  renderBoard();
  
}

function renderBoard(){
  document.querySelector('.js-game-board')
    .innerHTML = getHtml();

  if(!gameWon){
    document.querySelectorAll('.js-game-button').forEach((element, index) => element
    .addEventListener('click', function gameClick(){ choice(index)}));
  }
}

function getHtml(){
  let html = '';
  let i = 0;
  gameBoard.forEach((element) => {
    i++;
    html += `<button class="game-button js-game-button">${element}</button>`;

  });
  return html;
}

function nextPlayer(player){
  if(player === 'X'){
    return 'O';
  } else if(player === 'O'){
    return 'X';
  }
}


function checkWin(){
  if(checkColumns() || checkRows() || checkDiaganals()){
    gameWon = true;
    renderTurnText(currentPlayer);
  } else{
    renderTurnText(nextPlayer(currentPlayer));
  }
}

function checkDiaganals(){
  if(gameBoard[4] === ''){
    return false;
  }
  if(gameBoard[0] === gameBoard[4] 
    && gameBoard[4] === gameBoard[8]){
    return true;
  } else if(gameBoard[2] === gameBoard[4] 
    && gameBoard[4] === gameBoard[6]){
    return true;
  } else {
    return false;
  }
}

function checkRows(){
  const rows = 3;
  for(let i = 0; i < rows; i++){
    let row = i * 3;
    if(gameBoard[0 + row] === gameBoard[1 + row] 
      && gameBoard[1 + row] === gameBoard[2 + row]
      && gameBoard[0 + row] !== ''){
      return true;
    }
  }

  return false;
}

function checkColumns(){
  const columns = 3;
  for(let i = 0; i < columns; i++){
    if(gameBoard[0 + i] === gameBoard[3 + i] 
      && gameBoard[3 + i] === gameBoard[6 + i]
      && gameBoard[0 + i] !== ''){
      return true;
    }
  }

  return false;
}

function resetBoard(){
  gameBoard = ['', '', '',
              '', '', '',
              '', '', ''];
}