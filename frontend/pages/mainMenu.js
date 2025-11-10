import {
  createConfirmationModal,
  createConfirmationModalContent,
  createContainer,
  createCustomHeading,
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
  settingsModalInMainMenu,
  allModals,
  removeSingleLoadGameOption,
  removeLoadGameOptions,
  toggleDisplayById,
  closeConfirmationModal,
  changeTextOfErrorById,
  removeErrorById,
} from "../utils/index.js";

import playGamePageBuilder from "./playGame.js";
import highScoresPageBuilder from "./highScores.js";

const mainMenuPageBuilder = (settingsObj) => {
  // * Build the UI

  const body = returnBody();
  const mainMenuContainer = createContainer(
    "main",
    ["main-container", "main-menu-container"],
    "main-menu-container"
  );
  const settingsModal = createSettingsModal(settingsModalInMainMenu);
  const loadGameModal = createLoadGameModal("Cancel");
  const confirmationModal = createConfirmationModal();

  body.prepend(
    createCustomHeading("h1", "Main Menu", ["main-heading"], "main-heading"),
    mainMenuContainer,
    settingsModal,
    loadGameModal,
    confirmationModal
  );

  const mainMenuButtons = createMenuButtons(
    mainMenuButtonsContainerObj,
    mainMenuButtonObjs
  );
  mainMenuContainer.appendChild(mainMenuButtons);

  // * Add Event Listeners

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
    settingsModal.close();
  };

  const handleLoadGameFormSubmit = (e) => {
    e.preventDefault();

    const loadGameSelectElement = loadGameForm.elements[0];
    const selectedOption = grabSelectedOption(loadGameSelectElement);
    if (!selectedOption) {
      changeTextOfErrorById(
        "no-game-selected-error-message",
        "Please Select a Game to Load"
      );
      showErrorById("no-game-selected-error-message");
      return;
    }

    // * clean up any event listeners on this page
    // * remove the main container from the DOM
    // * call playGamePageBuilder and pass in the settings object as well as the name of the game to load
    // * close load game modal

    // ! REMOVE ALL OF THIS
    window.sessionStorage.setItem("gameToLoad", selectedOption);
    closeLoadGameModal(loadGameModal);
    window.location.assign("/play-game");
    // !
  };

  // Form Submit Events
  const updateSettingsForm = document.getElementById("update-settings-form");
  updateSettingsForm.addEventListener("submit", handleUpdateSettingsFormSubmit);

  const loadGameForm = document.getElementById("load-game-form");
  loadGameForm.addEventListener("submit", handleLoadGameFormSubmit);

  // Click Event Callbacks
  const handleNewGamebutton = () => {
    // * clean up any event listeners on this page
    // * remove the main container from the DOM
    cleanupFunction();
    // * call playGamePageBuilder and pass in the settings object
  };

  const handleOpenSettingsModal = () => {
    openSettingsModal(settingsObj, settingsModal);
  };

  const handleCloseSettingsModal = () => {
    settingsModal.close();
  };

  const handleOpenLoadGameModal = () => {
    openLoadGameModal(loadGameModal);
  };

  const handleCloseLoadGameModal = () => {
    closeLoadGameModal(loadGameModal);
  };

  const handleCloseConfirmationModalButton = () => {
    closeConfirmationModal(confirmationModal);
  };

  const handleDeleteSavedGameButton = () => {
    const loadGameSelectElement = loadGameForm.elements[0];
    const selectedOption = grabSelectedOption(loadGameSelectElement);
    if (!selectedOption) {
      changeTextOfErrorById(
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

  // Mouse Events
  document
    .getElementById("new-game-button")
    .addEventListener("click", handleNewGamebutton);

  document
    .getElementById("open-settings-modal-button")
    .addEventListener("click", handleOpenSettingsModal);

  document
    .getElementById("close-settings-modal-button")
    .addEventListener("click", handleCloseSettingsModal);

  document
    .getElementById("open-load-game-modal-button")
    .addEventListener("click", handleOpenLoadGameModal);

  document
    .getElementById("close-load-game-modal-button")
    .addEventListener("click", handleCloseLoadGameModal);

  document
    .getElementById("delete-saved-game-button")
    .addEventListener("click", handleDeleteSavedGameButton);

  document
    .getElementById("delete-all-saved-games-button")
    .addEventListener("click", handleDeleteAllSavedGamesButton);

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
        closeLoadGameModal(loadGameModal);
      }
    }
  };

  // Keyboard Event Listeners
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("keydown", handleKeyDown);

  const cleanupFunction = () => {
    // aggregates all elements that have event listeners on them in the form of: [ {"id-of-element", "type-of-event"} ];
    const objsWithEventListeners = [
      {
        idOfElement: "update-settings-form",
        typeOfEvent: "submit",
        callBack: handleUpdateSettingsFormSubmit,
      },
      {
        idOfElement: "load-game-form",
        typeOfEvent: "submit",
        callBack: handleLoadGameFormSubmit,
      },
      {
        idOfElement: "new-game-button",
        typeOfEvent: "click",
        callBack: handleNewGamebutton,
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
        idOfElement: "open-load-game-modal-button",
        typeOfEvent: "click",
        callBack: handleOpenLoadGameModal,
      },
      {
        idOfElement: "close-load-game-modal-button",
        typeOfEvent: "click",
        callBack: handleCloseLoadGameModal,
      },
      {
        idOfElement: "delete-saved-game-button",
        typeOfEvent: "click",
        callBack: handleDeleteSavedGameButton,
      },
      {
        idOfElement: "delete-all-saved-games-button",
        typeOfEvent: "click",
        callBack: handleDeleteAllSavedGamesButton,
      },

      { objOfListener: window, typeOfEvent: "keyup", callBack: handleKeyUp },
      {
        objOfListener: window,
        typeOfEvent: "keydown",
        callBack: handleKeyDown,
      },
    ];
    // loop over the array of elements and for each id-of-element, remove the type-of-event
    objsWithEventListeners.forEach((obj) => {
      if (obj.idOfElement) {
        document
          .getElementById(obj.idOfElement)
          .removeEventListener(obj.typeOfEvent, obj.callBack);
      } else {
        obj.objOfListener.removeEventListener(obj.typeOfEvent, obj.callBack);
      }
    });

    // remove the main-menu-container
  };
};

export default mainMenuPageBuilder;
