import {
  createControllerContainer,
  createControllerRow,
  createCustomHeading,
  createContainer,
  createSettingsModal,
  createSubHeaders,
  createMenuButtons,
  createPreviewImgContainer,
  createPlayerNameForm,
} from "../../components/index.js";
import HighScores from "../../high-scores/js/api/highScoresApi.js";
import Settings from "../../settings.js";
import {
  playGameSubHeaders,
  postGameMenuButtonObjs,
  returnBody,
  controllerRowObjs,
  settingsInputIds,
  displayCurrentSettingsOnForm,
  postGameMenuButtonsContainerObj,
  toggleDisplayById,
  verifyUniqueStrings,
  grabInputValuesFromForm,
  showErrorById,
  openSettingsModal,
  closeSettingsModal,
} from "../../utils/index.js";
import Tetris from "./game/tetris.js";

// Build out the UI

const body = returnBody();
body.prepend(
  createCustomHeading("h1", "Tetris", ["main-heading"], "main-heading")
);
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

const playerNameForm = createPlayerNameForm();
const postGameMenuButtons = createMenuButtons(
  postGameMenuButtonsContainerObj,
  postGameMenuButtonObjs
);

gameGridContainer.after(
  gameDetailsContainer,
  playerNameForm,
  postGameMenuButtons,
  settingsModal
);

// Instantiate the Settings object and the HighScores object
const settingsObj = new Settings();
const highScoresObj = new HighScores();

// 3. Write a function that handles all the tasks necessary when opening the modal.  Prefilling inputs, removing error message if it's there, and showModal().

// Instantiate the Tetris Game
const game = new Tetris(settingsObj, highScoresObj);

// Target Elements for Event Listeners
const modalCloseButton = document.getElementById("close-modal-button");
const rotateButton = document.getElementById("btn-up");
const softDropButton = document.getElementById("btn-down");
const moveLeftButton = document.getElementById("btn-left");
const moveRightButton = document.getElementById("btn-right");
const pauseButton = document.getElementById("btn-pause");

// Form Submit Events
playerNameForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const playerName = playerNameForm.elements.playerName.value;
  const playerScore = playerNameForm.elements.playerScore.value;
  const playerDetails = {
    name: playerName,
    score: Number(playerScore),
  };

  if (game.idOfScoreToRemove) {
    await highScoresObj.removeHighScore(game.idOfScoreToRemove);
  }

  await highScoresObj.addScoreToHighScores(playerDetails);

  toggleDisplayById("player-name-form");
  toggleDisplayById("post-game-menu-buttons");
});

const updateSettingsForm = document.getElementById("update-settings-form");
updateSettingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputsObj = grabInputValuesFromForm(updateSettingsForm);
  const keyControlInputVals = Object.values(inputsObj.keyControls);
  const allUniqueKeyControlVals = verifyUniqueStrings(keyControlInputVals);

  if (!allUniqueKeyControlVals) {
    showErrorById("settings-error-message");
    return;
  }

  const newSettings = {
    ...inputsObj,
  };

  settingsObj.updateSettings(newSettings);
  settingsModal.close();
  game.togglePause();
});

// Mouse Events
modalCloseButton.addEventListener("click", () => {
  closeSettingsModal(settingsModal);
  game.togglePause();
});

pauseButton.addEventListener("click", () => {
  openSettingsModal(settingsObj, settingsModal);
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
  if (game.gameOver) return;
  const keyName = e.key;
  // Event Listeners For Updating Game Controls From Main Menu
  const activeElement = document.activeElement;
  if (
    settingsInputIds.keyControlIds.includes(activeElement.getAttribute("id"))
  ) {
    activeElement.value = keyName;
    return;
  }

  // Event Listener for Pause Button During Gameplay
  if (keyName === settingsObj.keyControls.togglePause) {
    if (settingsModal.open) {
      closeSettingsModal(settingsModal);
    } else {
      openSettingsModal(settingsObj, settingsModal);
    }
    game.togglePause();
  }
});

window.addEventListener("keydown", (e) => {
  if (game.gameOver) return;
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
