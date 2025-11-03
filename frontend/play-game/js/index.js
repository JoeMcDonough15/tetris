import {
  createControllerContainer,
  createControllerRow,
  createCustomHeading,
  createContainer,
  createSettingsModal,
  createSubHeaders,
  createMenuButtons,
  createPreviewImgContainer,
  createErrorMessage,
} from "../../components/index.js";
import HighScores from "../../high-scores/js/api/highScoresApi.js";
import Settings from "../../settings.js";
import {
  menuButtonsContainerObj,
  playGameSubHeaders,
  postGameMenuButtonObjs,
  returnBody,
  controllerRowObjs,
  settingsInputIds,
  displayCurrentSettingsOnForm,
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

gameGridContainer.after(gameDetailsContainer, settingsModal);

// Instantiate the Settings object

// const settingsObj = new Settings(settingsModal, updateSettingsForm);
const settingsObj = new Settings();

// Instantiate a high scores object for use inside the Tetris game
const highScoresObj = new HighScores();

// Target DOM Elements for use in Tetris game
const playGameContainer = document.getElementById("play-game-container");
const mainHeading = document.getElementById("main-heading");
const previewImg = document.getElementById("preview-img");
const levelHeading = document.getElementById("level-heading");
const totalScoreHeading = document.getElementById("total-score-heading");
const rowsClearedHeading = document.getElementById("rows-cleared-heading");
const playerNameForm = document.getElementById("player-name-form");
const postGameMenuButtons = createMenuButtons(
  menuButtonsContainerObj,
  postGameMenuButtonObjs
);

// Instantiate the Tetris Game
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
// updateSettingsSubmitButton.addEventListener("click", () => {
//   setTimeout(() => {
//     if (settingsObj.settingsAppliedSuccessfully) {
//       game.togglePause();
//       settingsObj.settingsAppliedSuccessfully = false;
//     }
//   }, 150);
// });
const updateSettingsForm = document.getElementById("update-settings-form");
updateSettingsForm.addEventListener("submit", (e) => {
  console.log("running inside handle submit");
  e.preventDefault();
  // grab elements from form
  const updateSoundFxOnOff = updateSettingsForm.elements.soundFx.value;
  const updateMusicOnOff = updateSettingsForm.elements.music.value;
  const updateGameMusicSelection =
    updateSettingsForm.elements.gameMusicSelection.value;
  const updateColorPaletteSelection =
    updateSettingsForm.elements.colorPaletteSelection.value;
  const updateRotateControl = updateSettingsForm.elements.rotate.value;
  const updateMoveLeft = updateSettingsForm.elements.moveLeft.value;
  const updateMoveRight = updateSettingsForm.elements.moveRight.value;
  const updateSoftDrop = updateSettingsForm.elements.softDrop.value;
  const updateTogglePause = updateSettingsForm.elements.togglePause.value;
  const updatedKeyControlValues = [
    updateRotateControl,
    updateMoveLeft,
    updateMoveRight,
    updateSoftDrop,
    updateTogglePause,
  ];

  // helper function to verify unique inputs for key controls
  const verifyUniqueKeyControls = (newKeyControls) => {
    const CHAR_MAP = {};
    for (const newKey of newKeyControls) {
      if (CHAR_MAP[newKey]) return false;
      CHAR_MAP[newKey] = true;
    }
    return true;
  };

  // add error to form and return early if verification failed
  if (!verifyUniqueKeyControls(updatedKeyControlValues)) {
    const error = createErrorMessage("settings-error-message");
    updateSettingsForm.append(error);
    return;
  }

  // update settings
  settingsObj.updateSettings({
    updateSoundFxOnOff,
    updateMusicOnOff,
    updateGameMusicSelection,
    updateColorPaletteSelection,
    updatedKeyControlValues,
  });
  // close modal
  settingsModal.close();
  game.togglePause();
});

modalCloseButton.addEventListener("click", () => {
  settingsModal.close();
  game.togglePause();
});

pauseButton.addEventListener("click", () => {
  displayCurrentSettingsOnForm(settingsObj);
  // TODO clear any error state
  settingsModal.showModal();
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
