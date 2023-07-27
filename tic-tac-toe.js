let gameBoard;
let winMove;
let gameWon;
let currentPlayer;
let ai = 'O';
let isAI = false;

document.querySelector('.js-2-player-button')
  .addEventListener('click', game2Player);

document.querySelector('.js-ai-button')
  .addEventListener('click', gameAI);

function gameAI(){
  isAI = true;
  gameWon = false;
  resetBoard();
  renderBoard();

  currentPlayer = pickFirstPlayer();
  if(currentPlayer === ai) {
    getComputerMove();
  } else{
    renderTurnText(currentPlayer); 
  }
}

function game2Player(){
  gameWon = false;
  resetBoard();
  renderBoard();

  isAI = false;

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
  if(player === 'Tie'){
    document.querySelector('.js-turn-text')
      .innerHTML = `Tie`;
      return;
  }
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
  completeTurn();
  if(isAI && !gameWon){
    getComputerMove();
  }
}

function renderBoard(){
  if(!gameWon){
    document.querySelector('.js-game-board')
    .innerHTML = getHtml();

    document.querySelectorAll('.js-game-button').forEach((element, index) => element
    .addEventListener('click', function gameClick(){ choice(index)}));
  } else {
    document.querySelector('.js-game-board')
    .innerHTML = getHtmlWin();
  }
}

function getHtml(){
  let html = '';
  gameBoard.forEach((element) => {
    html += `<button class="game-button-play game-button js-game-button">${element}</button>`;

  });
  return html;
}

function getHtmlWin(){
  let html = '';
  const win1 = winMove[0];
  const win2 = winMove[1];
  const win3 = winMove[2];
  gameBoard.forEach((element, i) => {
    if(i === win1 || i === win2 || i === win3){
      html += `<button class="game-button-win-move game-button js-game-button">${element}</button>`;
    } else{
      html += `<button class="game-button-win game-button js-game-button">${element}</button>`;
    }

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

function checkWin(player){
  if(checkColumns() || checkRows() || checkDiaganals()){
    return player;
  } else if(checkTie()) {
    return 'tie';
  } else {
    return null;
  }
}


function completeTurn(){
  const result = checkWin(currentPlayer);
  if(result === currentPlayer){
    gameWon = true;
    renderTurnText(currentPlayer);
  } else if(result === 'tie'){
    gameWon = true;
    winMove = [null, null, null];
    renderTurnText('Tie');
  } else {
    renderTurnText(nextPlayer(currentPlayer));
  }
  renderBoard();
}

function checkDiaganals(){
  if(gameBoard[4] === ''){
    return false;
  }
  if(gameBoard[0] === gameBoard[4] 
    && gameBoard[4] === gameBoard[8]){
      winMove = [0, 4, 8];
      return true;
  } else if(gameBoard[2] === gameBoard[4] 
    && gameBoard[4] === gameBoard[6]){
      winMove = [2, 4, 6];
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
        winMove = [0 + row, 1 + row, 2 + row];
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
      winMove = [0 + i, 3 + i, 6 + i];
      return true;
    }
  }

  return false;
}

function checkTie(){
  let isTie = true;
  gameBoard.forEach((element) => {
    if(element === ''){
      isTie = false;
    }
  });
  return isTie;
}

function resetBoard(){
  gameBoard = ['', '', '',
              '', '', '',
              '', '', ''];
}

function getComputerMove(){
  let bestScore = -Infinity;
  let bestMove;
  gameBoard.forEach((element, i) => {
    // Is spot available?
    if(element === ''){
      gameBoard[i] = 'O';
      let score = minimax(gameBoard, 0, 'X', -Infinity, Infinity, false);
      gameBoard[i] = '';
      // Is spot best?
      if(score > bestScore){
        bestScore = score;
        bestMove = i;
      }
    }
  });
  // Play best move
  gameBoard[bestMove] = 'O';
  completeTurn();
}

let scores = {
  O: 1,
  X: -1,
  tie: 0
}

function minimax(board, depth, player, alpha, beta, isMaxing){
  let result = checkWin(nextPlayer(player));
  let score;
  let bestScore;

  if(result){
    score = scores[result];
    return score;
  }

  if(isMaxing){
    bestScore = -Infinity;
    for(let i = 0; i < board.length; i++){
      if(board[i] === ''){
        board[i] = ai;
        score = minimax(board, depth + 1,nextPlayer(player), alpha, beta, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(score, alpha);
        if(beta <= alpha){
          break;
        }
      }
    }
  } else {
    bestScore = Infinity;
    for(let i = 0; i < board.length; i++){
      if(board[i] === ''){
        board[i] = 'X';
        score = minimax(board, depth + 1, nextPlayer(player), alpha, beta, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, eval);
        if(beta <= alpha){
          break;
        }
      }
    }
  }
  return bestScore;
}