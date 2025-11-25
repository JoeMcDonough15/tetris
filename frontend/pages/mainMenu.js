import {
  createConfirmationModal,
  createConfirmationModalContent,
  createContainer,
  createCustomHeading,
  createImage,
  createLoadGameModal,
  createMenuButtons,
  createSettingsModal,
} from "../components/index.js";

import {
  mainMenuButtonsContainerObj,
  mainMenuButtonObjs,
  returnBody,
  settingsInputIds,
  openSettingsModal,
  grabInputValuesFromForm,
  verifyUniqueStrings,
  showErrorById,
  openLoadGameModal,
  closeLoadGameModal,
  grabSelectedOption,
  allModals,
  removeSingleLoadGameOption,
  removeLoadGameOptions,
  toggleDisplayById,
  closeConfirmationModal,
  updateElementTextById,
  removeErrorById,
  settingsModalInMainMenuObj,
  mainMenuImageData,
  injectTextIntoElementById,
} from "../utils/index.js";

import playGamePageBuilder from "./playGame.js";
import highScoresPageBuilder from "./highScores.js";

const mainMenuPageBuilder = (settingsObj) => {
  // * Build the UI

  const mainPageHeading = createCustomHeading(
    "h1",
    "Main Menu",
    ["main-heading", "main-menu-heading"],
    "main-heading"
  );
  const mainMenuContainer = createContainer(
    "main",
    ["main-container", "main-menu-container"],
    "main-menu-container"
  );
  const settingsModal = createSettingsModal(settingsModalInMainMenuObj);
  const loadGameModal = createLoadGameModal("Cancel");
  const confirmationModal = createConfirmationModal();

  const tetrisImage = createImage(mainMenuImageData);

  const mainMenuButtons = createMenuButtons(
    mainMenuButtonsContainerObj,
    mainMenuButtonObjs
  );
  mainMenuContainer.append(mainMenuButtons, tetrisImage);

  const body = returnBody();

  body.prepend(
    mainPageHeading,
    mainMenuContainer,
    settingsModal,
    loadGameModal,
    confirmationModal
  );

  // * Add Event Listeners

  // Target All Elements for Event Listeners
  const updateSettingsForm = document.getElementById("update-settings-form");
  const loadGameForm = document.getElementById("load-game-form");
  const newGameButton = document.getElementById("new-game-button");
  const highScoresButton = document.getElementById("view-high-scores-button");
  const openSettingsModalButton = document.getElementById(
    "open-settings-modal-button"
  );
  const closeSettingsModalButton = document.getElementById(
    "close-settings-modal-button"
  );
  const openLoadGameModalButton = document.getElementById(
    "open-load-game-modal-button"
  );
  const closeLoadGameModalButton = document.getElementById(
    "close-load-game-modal-button"
  );
  const deleteSavedGameButton = document.getElementById(
    "delete-saved-game-button"
  );
  const deleteAllSavedGamesButton = document.getElementById(
    "delete-all-saved-games-button"
  );

  // Form Submit Event Callbacks
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

  const handleLoadGameFormSubmit = (e) => {
    e.preventDefault();

    const loadGameSelectElement = loadGameForm.elements[0];
    const selectedOption = grabSelectedOption(loadGameSelectElement);
    if (!selectedOption) {
      updateElementTextById(
        "no-game-selected-error-message",
        "Please Select a Game to Load"
      );
      showErrorById("no-game-selected-error-message");
      return;
    }

    closeLoadGameModal();
    cleanupFunction();
    playGamePageBuilder(settingsObj, selectedOption);
  };

  // Click Event Callbacks
  const handleNewGamebutton = () => {
    cleanupFunction();
    playGamePageBuilder(settingsObj);
  };

  const handleViewHighScoresbutton = () => {
    cleanupFunction();
    highScoresPageBuilder(settingsObj);
  };

  const handleOpenSettingsModal = () => {
    openSettingsModal(settingsObj, settingsModal);
  };

  const handleCloseSettingsModal = () => {
    settingsModal.close();
  };

  const handleOpenLoadGameModal = () => {
    openLoadGameModal();
  };

  const handleCloseLoadGameModal = () => {
    closeLoadGameModal();
  };

  const handleCloseConfirmationModalButton = () => {
    closeConfirmationModal(confirmationModal);
  };

  const handleDeleteSavedGameButton = () => {
    const loadGameSelectElement = loadGameForm.elements[0];
    const selectedOption = grabSelectedOption(loadGameSelectElement);
    if (!selectedOption) {
      updateElementTextById(
        "no-game-selected-error-message",
        "Please Select a Game to Delete"
      );
      showErrorById("no-game-selected-error-message");
      return;
    }

    const modalContent = createConfirmationModalContent(
      allModals.confirmationModalData.confirmDeleteSavedGame
    );
    confirmationModal.appendChild(modalContent);

    const handleConfirmDeleteSavedGameButton = () => {
      const allSavedGames = JSON.parse(
        window.localStorage.getItem("savedGames")
      );
      const nameOfGameToDelete = selectedOption;
      const indexOfGameToDelete = allSavedGames.findIndex((savedGame) => {
        return savedGame.nameOfGame === nameOfGameToDelete;
      });
      allSavedGames.splice(indexOfGameToDelete, 1);
      if (!allSavedGames.length) {
        window.localStorage.removeItem("savedGames");
        toggleDisplayById("no-saved-games-heading", "load-game-form");
      } else {
        window.localStorage.setItem(
          "savedGames",
          JSON.stringify(allSavedGames)
        );
      }
      removeSingleLoadGameOption(nameOfGameToDelete);
      // TODO make a notification saying the game was successfully deleted that disappears after a setTimeout expires
      closeConfirmationModal(confirmationModal);
    };

    injectTextIntoElementById(
      "confirm-delete-game-modal-text",
      `Are you sure you want to delete game: ${selectedOption}?`
    );

    document
      .getElementById("confirm-delete-saved-game-button")
      .addEventListener("click", handleConfirmDeleteSavedGameButton, {
        once: true,
      });

    document
      .getElementById("close-confirmation-modal-button")
      .addEventListener("click", handleCloseConfirmationModalButton, {
        once: true,
      });

    removeErrorById("no-game-selected-error-message");
    confirmationModal.showModal();
  };

  const handleDeleteAllSavedGamesButton = () => {
    const modalContent = createConfirmationModalContent(
      allModals.confirmationModalData.confirmDeleteAllSavedGames
    );
    confirmationModal.appendChild(modalContent);

    const handleConfirmDeleteAllSavedGamesButton = () => {
      window.localStorage.removeItem("savedGames");
      removeLoadGameOptions();
      toggleDisplayById("no-saved-games-heading", "load-game-form");
      // TODO make a notification saying all games were successfully deleted that disappears after a setTimeout expires
      closeConfirmationModal(confirmationModal);
    };

    document
      .getElementById("confirm-delete-all-saved-games-button")
      .addEventListener("click", handleConfirmDeleteAllSavedGamesButton, {
        once: true,
      });

    document
      .getElementById("close-confirmation-modal-button")
      .addEventListener("click", handleCloseConfirmationModalButton, {
        once: true,
      });

    removeErrorById("no-game-selected-error-message");
    confirmationModal.showModal();
  };

  // Form Submit Events
  updateSettingsForm.addEventListener("submit", handleUpdateSettingsFormSubmit);
  loadGameForm.addEventListener("submit", handleLoadGameFormSubmit);

  // Mouse Events
  newGameButton.addEventListener("click", handleNewGamebutton);
  highScoresButton.addEventListener("click", handleViewHighScoresbutton);
  openSettingsModalButton.addEventListener("click", handleOpenSettingsModal);
  closeSettingsModalButton.addEventListener("click", handleCloseSettingsModal);
  openLoadGameModalButton.addEventListener("click", handleOpenLoadGameModal);
  closeLoadGameModalButton.addEventListener("click", handleCloseLoadGameModal);
  deleteSavedGameButton.addEventListener("click", handleDeleteSavedGameButton);
  deleteAllSavedGamesButton.addEventListener(
    "click",
    handleDeleteAllSavedGamesButton
  );

  // Keyboard Event Callbacks
  const handleKeyUp = (e) => {
    const keyName = e.key;
    const activeElement = document.activeElement;
    if (
      settingsInputIds.keyControlIds.includes(activeElement.getAttribute("id"))
    ) {
      activeElement.value = keyName;
    }
  };

  const handleKeyDown = (e) => {
    const keyName = e.key;
    if (keyName === "Escape") {
      if (confirmationModal.open) {
        closeConfirmationModal(confirmationModal);
      } else if (settingsModal.open) {
        settingsModal.close();
      } else {
        closeLoadGameModal();
      }
    }
  };

  // Keyboard Event Listeners
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("keydown", handleKeyDown);

  // * Cleanup Function

  const cleanupFunction = () => {
    // aggregates all elements that have event listeners on them in the form of: [ {"id-of-element", "type-of-event", eventHandlerFunction} ];
    const objsWithEventListeners = [
      {
        referenceToElement: updateSettingsForm,
        typeOfEvent: "submit",
        callBack: handleUpdateSettingsFormSubmit,
      },
      {
        referenceToElement: loadGameForm,
        typeOfEvent: "submit",
        callBack: handleLoadGameFormSubmit,
      },
      {
        referenceToElement: newGameButton,
        typeOfEvent: "click",
        callBack: handleNewGamebutton,
      },
      {
        referenceToElement: openSettingsModalButton,
        typeOfEvent: "click",
        callBack: handleOpenSettingsModal,
      },
      {
        referenceToElement: closeSettingsModalButton,
        typeOfEvent: "click",
        callBack: handleCloseSettingsModal,
      },
      {
        referenceToElement: openLoadGameModalButton,
        typeOfEvent: "click",
        callBack: handleOpenLoadGameModal,
      },
      {
        referenceToElement: closeLoadGameModalButton,
        typeOfEvent: "click",
        callBack: handleCloseLoadGameModal,
      },
      {
        referenceToElement: deleteSavedGameButton,
        typeOfEvent: "click",
        callBack: handleDeleteSavedGameButton,
      },
      {
        referenceToElement: deleteAllSavedGamesButton,
        typeOfEvent: "click",
        callBack: handleDeleteAllSavedGamesButton,
      },

      { typeOfEvent: "keyup", callBack: handleKeyUp },
      {
        typeOfEvent: "keydown",
        callBack: handleKeyDown,
      },
    ];
    // loop over the array of elements and for each id-of-element, remove the type-of-event
    objsWithEventListeners.forEach((obj) => {
      if (obj.referenceToElement) {
        obj.referenceToElement.removeEventListener(
          obj.typeOfEvent,
          obj.callBack
        );
      } else {
        window.removeEventListener(obj.typeOfEvent, obj.callBack);
      }
    });

    // remove the main header and the main element of MainMenu
    const elementsToRemove = [
      mainPageHeading,
      mainMenuContainer,
      settingsModal,
      loadGameModal,
      confirmationModal,
    ];
    elementsToRemove.forEach((element) => {
      element.remove();
    });
  };
};

export default mainMenuPageBuilder;
