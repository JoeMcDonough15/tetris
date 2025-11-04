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

// * Pause Menu Modal
// Build a component that renders a dialog similar to settingsModal but instead of a form on it,
// it should have a menuButtons component that uses data from utils called pauseGameMenuButtonObjs.
// This modal should open with openModal(pauseGameModal)
// one of these buttons should a button to save the game.
// The click event listener on that button should openModal(saveGameModal).  This shows a save game form also on a dialog.
// the save game form should have a single input (text) for the name of the game to save.
// on submit, the save game form should pull the input value off the form, and then pass it to
// the Tetris instance method saveGame(), like this: game.saveGame(nameOfGameToSaveTakenFromForm);
// after the game saves successfully, the save game form should be hidden with toggleDisplayById(idOfSaveGameForm)

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

// * Loading The Game
// * 1. Check window.sessionStorage for a gameToLoad key
// window.sessionStorage.getItem('gameToLoad')
// * 2. If it is there, retrieve it from sessionStorage, parse it, and keep the string as a constant that will be passed into Tetris as nameOfGameToLoad, or the 3rd argument to the class's constructor method.
// * 3. Remove the gameToLoad from sessionStorage after it has been retrieved.  That way, if the user refreshes the game, a new game will start
// rather than the saved game.  Refreshing the page should start a new game.  The only way to load a saved game would be to do so from the main menu.

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

  settingsObj.updateSettings({ ...inputsObj });
  closeSettingsModal(settingsModal);
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
