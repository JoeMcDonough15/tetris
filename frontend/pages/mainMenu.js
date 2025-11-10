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

  // Form Submit Events
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

  const loadGameForm = document.getElementById("load-game-form");
  loadGameForm.addEventListener("submit", (e) => {
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
    // ! REMOVE SESSION STORAGE now set that selected game name in window.sessionStorage as gameToLoad, then close the modal (clearing the options) and navigate to /play-game
    window.sessionStorage.setItem("gameToLoad", selectedOption);
    closeLoadGameModal(loadGameModal);
    window.location.assign("/play-game");
  });

  // Mouse Events
  document
    .getElementById("open-settings-modal-button")
    .addEventListener("click", () => {
      openSettingsModal(settingsObj, settingsModal);
    });

  document
    .getElementById("close-settings-modal-button")
    .addEventListener("click", () => {
      settingsModal.close();
    });

  document
    .getElementById("open-load-game-modal-button")
    .addEventListener("click", () => {
      openLoadGameModal(loadGameModal);
    });

  document
    .getElementById("close-load-game-modal-button")
    .addEventListener("click", () => {
      closeLoadGameModal(loadGameModal);
    });

  document
    .getElementById("delete-saved-game-button")
    .addEventListener("click", () => {
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
      document
        .getElementById("confirm-delete-saved-game-button")
        .addEventListener("click", () => {
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
        });

      document
        .getElementById("close-confirmation-modal-button")
        .addEventListener("click", () => {
          closeConfirmationModal(confirmationModal);
        });

      removeErrorById("no-game-selected-error-message");
      confirmationModal.showModal();
    });

  document
    .getElementById("delete-all-saved-games-button")
    .addEventListener("click", () => {
      const modalContent = createConfirmationModalContent(
        allModals.confirmationModalData.confirmDeleteAllSavedGames
      );
      confirmationModal.appendChild(modalContent);

      document
        .getElementById("confirm-delete-all-saved-games-button")
        .addEventListener("click", () => {
          window.localStorage.removeItem("savedGames");
          removeLoadGameOptions();
          toggleDisplayById("no-saved-games-heading", "load-game-form");
          // TODO make a notification saying all games were successfully deleted that disappears after a setTimeout expires
          closeConfirmationModal(confirmationModal);
        });

      document
        .getElementById("close-confirmation-modal-button")
        .addEventListener("click", () => {
          closeConfirmationModal(confirmationModal);
        });

      removeErrorById("no-game-selected-error-message");
      confirmationModal.showModal();
    });

  // Keyboard Events
  window.addEventListener("keyup", (e) => {
    const keyName = e.key;
    const activeElement = document.activeElement;
    if (
      settingsInputIds.keyControlIds.includes(activeElement.getAttribute("id"))
    ) {
      activeElement.value = keyName;
    }
  });

  window.addEventListener("keydown", (e) => {
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
  });
};

export default mainMenuPageBuilder;
