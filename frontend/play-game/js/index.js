import {
  createControllerContainer,
  createControllerRow,
  createCustomHeading,
  createContainer,
  createSettingsModal,
  createSubHeaders,
  createMenuButtons,
  createPreviewImgContainer,
} from "../../components/index.js";
import HighScores from "../../high-scores/js/api/highScoresApi.js";
import Settings from "../../settings.js";
import {
  menuButtonsContainerObj,
  playGameSubHeaders,
  postGameMenuButtonObjs,
  returnBody,
  controllerRowObjs,
} from "../../utils/index.js";
import Tetris from "./game/tetris.js";

// Build out the UI

const body = returnBody();
body.prepend(createCustomHeading("h1", "Tetris", "main-heading"));

// target gameGridContainer to inject this UI after it
const gameGridContainer = document.getElementById("game-grid-container");

// Build out the gameDetailsContainer
const gameDetailsContainer = createContainer(
  "section",
  ["game-details-container"],
  "game-details-container"
);

const subHeadersContainer = createSubHeaders("h3", playGameSubHeaders);

const previewImgContainer = createPreviewImgContainer("preview-img-container");

const controllerContainer = createControllerContainer();

const controllerRowOne = createControllerRow(
  "controller-row-one",
  controllerRowObjs.rowOne
);
const controllerRowTwo = createControllerRow(
  "controller-row-two",
  controllerRowObjs.rowTwo
);
const controllerRowThree = createControllerRow(
  "controller-row-three",
  controllerRowObjs.rowThree
);

controllerContainer.append(
  controllerRowOne,
  controllerRowTwo,
  controllerRowThree
);

gameDetailsContainer.append(
  subHeadersContainer,
  previewImgContainer,
  controllerContainer
);

const settingsModal = createSettingsModal("Return to Game");

gameGridContainer.after(gameDetailsContainer, settingsModal);

// Instantiate the Settings object
const updateSettingsForm = document.getElementById("update-settings-form");
const savedSettings = JSON.parse(
  window.sessionStorage.getItem("savedSettings")
);

const settingsObj = new Settings(
  settingsModal,
  updateSettingsForm,
  savedSettings
);

// Instantiate a high scores object for use inside the Tetris game
const highScoresObj = new HighScores();

// Target DOM Elements for use in Tetris game
const playGameContainer = document.getElementById("play-game-container");
const mainHeading = document.getElementById("main-heading");
const previewImg = document.getElementById("preview-img");
const levelHeading = document.getElementById("level-heading");
const totalScoreHeading = document.getElementById("total-score-heading");
const rowsClearedHeading = document.getElementById("rows-cleared-heading");
const postGameMenuButtons = createMenuButtons(
  menuButtonsContainerObj,
  postGameMenuButtonObjs
);

// Instantiate the Tetris game
const game = new Tetris(
  settingsObj,
  highScoresObj,
  settingsModal,
  playGameContainer,
  gameGridContainer,
  gameDetailsContainer,
  mainHeading,
  previewImg,
  levelHeading,
  totalScoreHeading,
  rowsClearedHeading,
  postGameMenuButtons
);

// Target Elements for Event Listeners
const modalCloseButton = document.getElementById("close-modal-button");
const rotateButton = document.getElementById("btn-up");
const softDropButton = document.getElementById("btn-down");
const moveLeftButton = document.getElementById("btn-left");
const moveRightButton = document.getElementById("btn-right");
const pauseButton = document.getElementById("btn-pause");
const scoreHeading = document.getElementById("total-score-heading");
const updateSettingsSubmitButton = document.getElementById(
  "update-settings-submit-button"
);

scoreHeading.innerText = `Score: ${game.playerTotalScore}`;

// Mouse Events
updateSettingsSubmitButton.addEventListener("click", () => {
  game.togglePause();
});

modalCloseButton.addEventListener("click", () => {
  settingsModal.close();
  game.togglePause();
});

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

// Key Events
window.addEventListener("keyup", (e) => {
  if (e.key === settingsObj.keyControls.togglePause) {
    game.togglePause();
  }
});

window.addEventListener("keydown", (e) => {
  const keyName = e.key;
  if (keyName === settingsObj.keyControls.rotate) {
    game.rotatePiece();
  } else if (keyName === settingsObj.keyControls.moveLeft) {
    game.moveShape("left");
  } else if (keyName === settingsObj.keyControls.moveRight) {
    game.moveShape("right");
  } else if (keyName === settingsObj.keyControls.softDrop) {
    game.softDrop();
  } else if (keyName === "Escape" && game.gamePaused) {
    game.togglePause();
  }
});

game.startGame();
