import Tetris from "./tetris.js";

const game = new Tetris();

window.addEventListener("keyup", game.pauseGame);
window.addEventListener("keydown", game.pieceControllerEvents);

game.dequeuePiece(); // begins game
