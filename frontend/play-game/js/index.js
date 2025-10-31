import { createSettingsModal } from "../../components/index.js";
import Settings from "../../settings.js";
import Tetris from "./game/tetris.js";

const settingsModal = createSettingsModal("Return to Game");
const bodyArrayFromCollection = Array.from(
  document.getElementsByTagName("body")
);
const body = bodyArrayFromCollection[0];
body.appendChild(settingsModal);
const updateSettingsForm = document.getElementById("update-settings-form");
const savedSettings = JSON.parse(
  window.sessionStorage.getItem("savedSettings")
);

const settingsObj = new Settings(
  settingsModal,
  updateSettingsForm,
  savedSettings
);
settingsObj.listenForSettingsUpdates(); // add event listener for form submission to update settings

const game = new Tetris(settingsObj, settingsModal);

const updateSettingsSubmitButton = document.getElementById(
  "update-settings-submit-button"
);

updateSettingsSubmitButton.addEventListener("click", () => {
  game.togglePause();
});

const modalCloseButton = document.getElementById("close-modal-button");
modalCloseButton.addEventListener("click", () => {
  settingsModal.close();
  game.togglePause();
});

const rotateButton = document.getElementById("btn-up");
const softDropButton = document.getElementById("btn-down");
const moveLeftButton = document.getElementById("btn-left");
const moveRightButton = document.getElementById("btn-right");
const pauseButton = document.getElementById("btn-pause");

const scoreHeading = document.getElementById("total-score-heading");
scoreHeading.innerText = `Score: ${game.playerTotalScore}`;

// mouse events

pauseButton.addEventListener("click", () => {
  game.togglePause();
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
    game.togglePause();
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
  } else if (keyName === "Escape" && game.gamePaused) {
    game.togglePause();
  }
});

game.dequeuePiece(); // begins game
