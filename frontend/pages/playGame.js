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
  createConfirmationModalContent,
  createCanvas,
  createLoadingBar,
} from "../components/index.js";
import HighScores from "../utils/highScoresHelpers.js";
import {
  playGameSubHeaders,
  postGameMenuButtonObjs,
  returnBody,
  controllerRowObjs,
  settingsInputIds,
  postGameMenuButtonsContainerObj,
  verifyUniqueStrings,
  grabInputValuesFromForm,
  showErrorById,
  openSettingsModal,
  closeConfirmationModal,
  allModals,
  settingsModalInGameObj,
  openSaveGameModal,
  handleUpdateSavedGameTextInput,
  closeSaveGameModal,
  removeCommasFromScore,
} from "../utils/index.js";
import Tetris from "../game/tetris.js";
import mainMenuPageBuilder from "./mainMenu.js";
import highScoresPageBuilder from "./highScores.js";

const playGamePageBuilder = (settingsObj, gameToLoad) => {
  // * Build out the UI

  const mainHeading = createCustomHeading(
    "h1",
    "Tetris",
    ["main-heading"],
    "main-heading"
  );

  const mainContainer = createContainer(
    "main",
    ["play-game-container", "main-container"],
    "play-game-container"
  );

  const gameGridContainer = createContainer(
    "section",
    ["game-grid-container"],
    "game-grid-container"
  );
  const canvas = createCanvas();
  gameGridContainer.append(canvas);

  const gameDetailsContainer = createContainer(
    "section",
    ["game-details-container"],
    "game-details-container"
  );
  const subHeadersContainer = createSubHeaders("h3", playGameSubHeaders);
  const previewImgContainer = createPreviewImgContainer(
    "preview-img-container"
  );
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

  // modals
  const pauseModal = createPauseModal(); // * ----------> confirmQuitModal or settingsModal
  const settingsModal = createSettingsModal(settingsModalInGameObj);
  const saveGameModal = createSaveGameModal(); // * ----------> confirmOverwriteGameModal
  const confirmationModal = createConfirmationModal();

  // post game options
  const playerNameForm = createPlayerNameForm();
  const noHighScoreHeading = createCustomHeading(
    "h2",
    "No High Score This Time",
    ["high-score-heading", "no-high-score-heading", "no-display"],
    "no-high-score-heading"
  );
  const postGameMenuButtons = createMenuButtons(
    postGameMenuButtonsContainerObj,
    postGameMenuButtonObjs
  );
  const loadingBar = createLoadingBar("", ["no-display"]);

  mainContainer.append(
    loadingBar,
    gameGridContainer,
    gameDetailsContainer,
    playerNameForm,
    noHighScoreHeading,
    postGameMenuButtons
  );

  const body = returnBody();
  body.prepend(
    mainHeading,
    mainContainer,
    pauseModal,
    settingsModal,
    saveGameModal,
    confirmationModal
  );

  // * Instantiate Necessary Classes
  const highScoresObj = new HighScores();
  const game = new Tetris(settingsObj, highScoresObj, gameToLoad);

  // * Target Elements for Event Listeners
  const updateSettingsForm = document.getElementById("update-settings-form");
  const saveGameForm = document.getElementById("save-game-form");
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
  const quitGameButton = document.getElementById(
    "open-confirm-quit-game-modal-button"
  );
  const savedGamesDropdownMenu = document.getElementById("load-game-select");
  const mainMenuButton = document.getElementById("main-menu-button");
  const highScoresButton = document.getElementById("view-high-scores-button");

  // * Event Listeners

  // Event Callbacks

  const handlePlayerNameFormSubmit = async (e) => {
    e.preventDefault();
    const playerName = playerNameForm.elements.playerName.value;
    const playerScore = playerNameForm.elements.playerScore.value;
    const playerDetails = {
      name: playerName,
      score: Number(removeCommasFromScore(playerScore)),
    };

    // TODO insert loading bar here

    if (game.idOfScoreToRemove) {
      await highScoresObj.removeHighScore(game.idOfScoreToRemove);
    }
    await highScoresObj.addScoreToHighScores(playerDetails);

    cleanupFunction();
    highScoresPageBuilder(settingsObj);
  };

  const handleUpdateSettingsFormSubmit = (e) => {
    e.preventDefault();
    const inputsObj = grabInputValuesFromForm(updateSettingsForm);
    const keyControlInputVals = Object.values(inputsObj.keyControls);
    const allUniqueKeyControlVals = verifyUniqueStrings(keyControlInputVals);

    if (!allUniqueKeyControlVals) {
      showErrorById("settings-error-message");
      return;
    }

    settingsObj.updateSettings({ ...inputsObj });
    body.className = "";
    body.classList.add(`theme-${settingsObj.colorPaletteSelection}`);
    settingsModal.close();
  };

  const handleSaveGameFormSubmit = (e) => {
    e.preventDefault();
    const nameOfGameToSave = saveGameForm.elements.gameToSave.value;
    game.checkForSavedGame(nameOfGameToSave);
  };

  const handlePauseGame = () => {
    pauseModal.showModal();
    game.togglePause();
  };

  const handleUnpauseGame = () => {
    pauseModal.close();
    game.togglePause();
  };

  const handleOpenSettingsModal = () => {
    openSettingsModal(settingsObj, settingsModal);
  };

  const handleCloseSettingsModal = () => {
    settingsModal.close();
  };

  const handleOpenSaveGameModal = () => {
    openSaveGameModal();
  };

  const handleCloseSaveGameModal = () => {
    closeSaveGameModal();
  };

  const handleQuitGameButton = () => {
    const modalContent = createConfirmationModalContent(
      allModals.confirmationModalData.confirmQuitGame
    );

    confirmationModal.appendChild(modalContent);

    document.getElementById("confirm-quit-game-button").addEventListener(
      "click",
      () => {
        cleanupFunction();
        mainMenuPageBuilder(settingsObj);
        closeConfirmationModal(confirmationModal);
      },
      { once: true }
    );

    document.getElementById("close-confirmation-modal-button").addEventListener(
      "click",
      () => {
        closeConfirmationModal(confirmationModal);
      },
      { once: true }
    );

    confirmationModal.showModal();
  };

  const handleRotateButton = () => {
    if (!game.currentPieceInPlay) return;
    game.rotatePiece();
  };

  const handleMoveLeftButton = () => {
    if (!game.currentPieceInPlay) return;
    game.moveShape("left");
  };

  const handleMoveRightButton = () => {
    if (!game.currentPieceInPlay) return;
    game.moveShape("right");
  };

  const handleSoftDropButton = () => {
    game.softDrop();
  };

  const handleMainMenuButton = () => {
    cleanupFunction();
    mainMenuPageBuilder(settingsObj);
  };

  const handleViewHighScoresButton = () => {
    cleanupFunction();
    highScoresPageBuilder(settingsObj);
  };

  const handleKeyUp = (e) => {
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
      if (settingsModal.open || saveGameModal.open || confirmationModal.open)
        return;

      if (pauseModal.open) {
        pauseModal.close();
      } else {
        pauseModal.showModal();
      }
      game.togglePause();
    }
  };

  const handleKeyDown = (e) => {
    if (game.gameOver) return;
    const keyName = e.key;
    if (keyName === settingsObj.keyControls.rotate) {
      if (!game.currentPieceInPlay) return;
      game.rotatePiece();
    } else if (keyName === settingsObj.keyControls.moveLeft) {
      if (!game.currentPieceInPlay) return;
      game.moveShape("left");
    } else if (keyName === settingsObj.keyControls.moveRight) {
      if (!game.currentPieceInPlay) return;
      game.moveShape("right");
    } else if (keyName === settingsObj.keyControls.softDrop) {
      game.softDrop();
    } else if (keyName === "Escape") {
      if (confirmationModal.open) {
        closeConfirmationModal();
      } else if (settingsModal.open) {
        settingsModal.close();
      } else if (saveGameModal.open) {
        closeSaveGameModal();
      } else if (game.gamePaused) {
        pauseModal.close();
        game.togglePause();
      }
    }
  };

  // Form Submit Events
  playerNameForm.addEventListener("submit", handlePlayerNameFormSubmit);
  updateSettingsForm.addEventListener("submit", handleUpdateSettingsFormSubmit);
  saveGameForm.addEventListener("submit", handleSaveGameFormSubmit);

  // Mouse Events
  pauseButton.addEventListener("click", handlePauseGame);
  closePauseModalButton.addEventListener("click", handleUnpauseGame);
  openSettingsModalButton.addEventListener("click", handleOpenSettingsModal);
  closeSettingsModalButton.addEventListener("click", handleCloseSettingsModal);
  openSaveGameModalButton.addEventListener("click", handleOpenSaveGameModal);
  savedGamesDropdownMenu.addEventListener(
    "change",
    handleUpdateSavedGameTextInput
  );
  closeSaveGameModalButton.addEventListener("click", handleCloseSaveGameModal);
  quitGameButton.addEventListener("click", handleQuitGameButton);
  rotateButton.addEventListener("click", handleRotateButton);
  moveLeftButton.addEventListener("click", handleMoveLeftButton);
  moveRightButton.addEventListener("click", handleMoveRightButton);
  softDropButton.addEventListener("click", handleSoftDropButton);
  mainMenuButton.addEventListener("click", handleMainMenuButton);
  highScoresButton.addEventListener("click", handleViewHighScoresButton);

  // Key Events
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("keydown", handleKeyDown);

  // * Cleanup Function

  const cleanupFunction = () => {
    const objsWithEventListeners = [
      {
        idOfElement: "player-name-form",
        typeOfEvent: "submit",
        callBack: handlePlayerNameFormSubmit,
      },
      {
        idOfElement: "update-settings-form",
        typeOfEvent: "submit",
        callBack: handleUpdateSettingsFormSubmit,
      },
      {
        idOfElement: "save-game-form",
        typeOfEvent: "submit",
        callBack: handleSaveGameFormSubmit,
      },
      {
        idOfElement: "btn-pause",
        typeOfEvent: "click",
        callBack: handlePauseGame,
      },
      {
        idOfElement: "close-pause-modal-button",
        typeOfEvent: "click",
        callBack: handleUnpauseGame,
      },
      {
        idOfElement: "open-settings-modal-button",
        typeOfEvent: "click",
        callBack: handleOpenSettingsModal,
      },
      {
        idOfElement: "close-settings-modal-button",
        typeOfEvent: "click",
        callBack: handleCloseSettingsModal,
      },
      {
        idOfElement: "open-save-game-modal-button",
        typeOfEvent: "click",
        callBack: handleOpenSaveGameModal,
      },
      {
        idOfElement: "load-game-select",
        typeOfEvent: "change",
        callBack: handleUpdateSavedGameTextInput,
      },
      {
        idOfElement: "close-save-game-modal-button",
        typeOfEvent: "click",
        callBack: handleCloseSaveGameModal,
      },
      {
        idOfElement: "open-confirm-quit-game-modal-button",
        typeOfEvent: "click",
        callBack: handleQuitGameButton,
      },
      {
        idOfElement: "btn-up",
        typeOfEvent: "click",
        callBack: handleRotateButton,
      },
      {
        idOfElement: "btn-left",
        typeOfEvent: "click",
        callBack: handleMoveLeftButton,
      },
      {
        idOfElement: "btn-right",
        typeOfEvent: "click",
        callBack: handleMoveRightButton,
      },
      {
        idOfElement: "btn-down",
        typeOfEvent: "click",
        callBack: handleSoftDropButton,
      },
      {
        idOfElement: "main-menu-button",
        typeOfEvent: "click",
        callBack: handleMainMenuButton,
      },
      {
        idOfElement: "view-high-scores-button",
        typeOfEvent: "click",
        callBack: handleViewHighScoresButton,
      },
      { objOfListener: window, typeOfEvent: "keyup", callBack: handleKeyUp },
      {
        objOfListener: window,
        typeOfEvent: "keydown",
        callBack: handleKeyDown,
      },
    ];

    objsWithEventListeners.forEach((obj) => {
      if (obj.idOfElement) {
        document
          .getElementById(obj.idOfElement)
          .removeEventListener(obj.typeOfEvent, obj.callBack);
      } else {
        obj.objOfListener.removeEventListener(obj.typeOfEvent, obj.callBack);
      }
    });

    const elementsToRemove = [
      mainHeading,
      mainContainer,
      pauseModal,
      settingsModal,
      saveGameModal,
      confirmationModal,
    ];
    elementsToRemove.forEach((element) => {
      element.remove();
    });
  };

  game.startGame();
};

export default playGamePageBuilder;
