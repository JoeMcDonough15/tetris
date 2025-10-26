import Tetris from "./tetris.js";

const game = new Tetris();
const rotateButton = document.getElementById("btn-up");
const softDropButton = document.getElementById("btn-down");
const moveLeftButton = document.getElementById("btn-left");
const moveRightButton = document.getElementById("btn-right");
const pauseButton = document.getElementById("btn-pause");

// mouse events

pauseButton.addEventListener("click", () => {
  game.pauseGame();
});

rotateButton.addEventListener("click", () => {
  game.rotatePiece();
});

moveLeftButton.addEventListener("click", () => {
  game.moveShape("left");
});

moveRightButton.addEventListener("click", () => {
  game.moveShape("right");
});

softDropButton.addEventListener("click", () => {
  game.softDrop();
});

// key events
window.addEventListener("keyup", (e) => {
  if (e.key === "p") {
    game.pauseGame();
  }
});

window.addEventListener("keydown", (e) => {
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
