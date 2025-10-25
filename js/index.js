import Tetris from "./tetris.js";

const game = new Tetris();
const upButton = document.getElementById("btn-up");
const downButton = document.getElementById("btn-down");
const leftButton = document.getElementById("btn-left");
const rightButton = document.getElementById("btn-right");
const pauseButton = document.getElementById("btn-pause");

// mouse events

pauseButton.addEventListener("click", () => {
  game.pauseGame();
});

// key events
window.addEventListener("keyup", (e) => {
  if (e.key === "p") {
    game.pauseGame();
  }
});
window.addEventListener("keydown", (e) => {
  if (game.gamePaused || game.currentPiecePlaced) return;
  const keyName = e.key;
  if (keyName === "ArrowRight") {
    game.moveShape("right");
  } else if (keyName === "ArrowLeft") {
    game.moveShape("left");
  } else if (keyName === "r" || keyName === "ArrowUp") {
    game.rotatePiece();
  } else if (keyName === "ArrowDown") {
    game.softDrop();
  }
});

game.dequeuePiece(); // begins game
