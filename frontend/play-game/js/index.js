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
  createPauseModal,
  createSaveGameModal,
  createConfirmationModal,
  createReusableConfirmationModal,
  createConfirmationModalContent,
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
  settingsModalInGame,
  // confirmOverwriteGameModalObj,
  // confirmQuitGameModalObj,
  closeConfirmationModal,
  allModals,
} from "../../utils/index.js";
import Tetris from "./game/tetris.js";

// Build out the UI

const body = returnBody();
body.prepend(
  createCustomHeading("h1", "Tetris", ["main-heading"], "main-heading")
);

const gameGridContainer = document.getElementById("game-grid-container");
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

const pauseModal = createPauseModal(); // * ----------> confirmQuitModal
const settingsModal = createSettingsModal(settingsModalInGame);
const saveGameModal = createSaveGameModal(); // * ----------> confirmOverwriteGameModal
const confirmationModal = createReusableConfirmationModal();

// const confirmOverwriteGameModal = createConfirmationModal(
//   confirmOverwriteGameModalObj
// );
// const confirmQuitGameModal = createConfirmationModal(confirmQuitGameModalObj);

const playerNameForm = createPlayerNameForm();
const postGameMenuButtons = createMenuButtons(
  postGameMenuButtonsContainerObj,
  postGameMenuButtonObjs
);

gameGridContainer.after(
  gameDetailsContainer,
  playerNameForm,
  postGameMenuButtons,
  // * top level modal - pauseModal --> either settingsModal or saveGameModal
  pauseModal,
  // * second level modal - either settingsModal or saveGameModal --> confirmationModal
  settingsModal,
  saveGameModal,
  // * third level confirmation modal - either confirmOverwriteGameModal or confirmQuitGameModal
  // TODO - one confirmation modal that gets different content injected into it whenever it opens
  // confirmOverwriteGameModal,
  // confirmQuitGameModal
  confirmationModal
);

// Instantiate Necessary Classes
const settingsObj = new Settings();
const highScoresObj = new HighScores();

// Load a Saved Game if Needed
const gameToLoad = window.sessionStorage.getItem("gameToLoad");
if (gameToLoad) {
  window.sessionStorage.removeItem("gameToLoad");
}

// Instantiate the Tetris Game
const game = new Tetris(settingsObj, highScoresObj, gameToLoad);

// Target Elements for Event Listeners

const rotateButton = document.getElementById("btn-up");
const softDropButton = document.getElementById("btn-down");
const moveLeftButton = document.getElementById("btn-left");
const moveRightButton = document.getElementById("btn-right");
const pauseButton = document.getElementById("btn-pause");
const closePauseModalButton = document.getElementById(
  "close-pause-modal-button"
);
const openSettingsModalButton = document.getElementById(
  "open-settings-modal-button"
);
const closeSettingsModalButton = document.getElementById(
  "close-settings-modal-button"
);
const openSaveGameModalButton = document.getElementById(
  "open-save-game-modal-button"
);
const closeSaveGameModalButton = document.getElementById(
  "close-save-game-modal-button"
);

// const confirmOverwriteGameButton = document.getElementById(
//   "confirm-overwrite-button"
// );

// const closeConfirmOverwriteModalButton = document.getElementById(
//   "close-overwrite-game-modal-button"
// );

const quitGameButton = document.getElementById(
  "open-confirm-quit-game-modal-button"
);

// const confirmQuitGameButton = document.getElementById(
//   "confirm-quit-game-button"
// );

// const closeQuitGameModalButton = document.getElementById(
//   "close-quit-game-modal-button"
// );

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
  settingsModal.close();
});

const saveGameForm = document.getElementById("save-game-form");
saveGameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameOfGameToSave = saveGameForm.elements.gameToSave.value;
  game.checkForSavedGame(nameOfGameToSave);
});

// Mouse Events
pauseButton.addEventListener("click", () => {
  pauseModal.showModal();
  game.togglePause();
});

closePauseModalButton.addEventListener("click", () => {
  pauseModal.close();
  game.togglePause();
});

openSettingsModalButton.addEventListener("click", () => {
  openSettingsModal(settingsObj, settingsModal);
});

closeSettingsModalButton.addEventListener("click", () => {
  settingsModal.close();
});

openSaveGameModalButton.addEventListener("click", () => {
  // TODO write a function that opens the modal after clearing any previous value inside the nameOfGame text input
  saveGameModal.showModal();
});

closeSaveGameModalButton.addEventListener("click", () => {
  saveGameModal.close();
});

// confirmOverwriteGameButton.addEventListener("click", () => {
//   game.saveGame();
// });

// closeConfirmOverwriteModalButton.addEventListener("click", () => {
//   game.nameOfGameToSave = null;
//   game.indexOfGameToOverwrite = -1;
//   confirmOverwriteGameModal.close();
// });

quitGameButton.addEventListener("click", () => {
  const modalContent = createConfirmationModalContent(
    allModals.confirmationModalData.confirmQuitGame
  );

  confirmationModal.appendChild(modalContent);

  //!

  //* ADD THE CONFIRM QUIT GAME GAME EVENT LISTENER, since this element now exists on the DOM
  document
    .getElementById("confirm-quit-game-button")
    .addEventListener("click", () => {
      game.quitGame();
    });

  //* CANCEL AND CLOSE CONFIRMATION MODAL EVENT LISTENER
  document
    .getElementById("close-confirmation-modal-button")
    .addEventListener("click", () => {
      closeConfirmationModal(confirmationModal);
    });

  //!

  confirmationModal.showModal();
});

// confirmQuitGameButton.addEventListener("click", () => {
//   game.quitGame();
// });

// closeQuitGameModalButton.addEventListener("click", () => {
//   confirmQuitGameModal.close();
// });

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
  // Event Listeners For Updating keyControls Inside Settings Modal
  const activeElement = document.activeElement;
  if (
    settingsInputIds.keyControlIds.includes(activeElement.getAttribute("id"))
  ) {
    activeElement.value = keyName;
    return;
  }

  // Event Listener for Pause Button During Gameplay
  if (keyName === settingsObj.keyControls.togglePause) {
    if (pauseModal.open) {
      pauseModal.close();
    } else {
      pauseModal.showModal();
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
  } else if (
    keyName === "Escape" &&
    game.gamePaused &&
    // TODO && !secondLevelModal.open && !confirmationModal.open (because secondLevelModal will inject with content for all 3 of these modals)
    !settingsModal.open &&
    !saveGameModal.open &&
    !confirmQuitGameModal.open
  ) {
    game.togglePause();
  }
});

game.startGame();
