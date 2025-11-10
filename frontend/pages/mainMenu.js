import {
  createConfirmationModal,
  createConfirmationModalContent,
  createContainer,
  createCustomHeading,
  createLoadGameModal,
  createMenuButtons,
  createReusableConfirmationModal,
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
  // Build out the UI
  const body = returnBody();
  const mainMenuContainer = createContainer(
    "main",
    ["main-container", "main-menu-container"],
    "main-menu-container"
  );
  const settingsModal = createSettingsModal(settingsModalInMainMenu);
  const loadGameModal = createLoadGameModal("Cancel");
  // ! use line 37 after component gets renamed
  // const confirmationModal = createConfirmationModal();
  const confirmationModal = createReusableConfirmationModal();

  body.prepend(
    createCustomHeading("h1", "Main Menu", ["main-heading"], "main-heading"),
    mainMenuContainer,
    // * top level modal - settingsModal, loadGameModal --> confirmationModal
    settingsModal,
    loadGameModal,
    // * second level modal - confirmation modal
    confirmationModal
  );

  const mainMenuButtons = createMenuButtons(
    mainMenuButtonsContainerObj,
    mainMenuButtonObjs
  );
  mainMenuContainer.appendChild(mainMenuButtons);

  // * Event Listeners

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
    const selectedOption = grabSelectedOption(loadGameSelectElement); // either an option.value or undefined
    if (!selectedOption) {
      changeTextOfErrorById(
        "no-game-selected-error-message",
        "Please Select a Game to Load"
      );
      showErrorById("no-game-selected-error-message");
      return;
    }
    // now set that selected game name in window.sessionStorage as gameToLoad, then close the modal (clearing the options) and navigate to /play-game
    window.sessionStorage.setItem("gameToLoad", selectedOption);
    closeLoadGameModal(loadGameModal); // which removes all option elements from the select element
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

  // delete one game event listener
  document
    .getElementById("delete-saved-game-button")
    .addEventListener("click", () => {
      const loadGameSelectElement = loadGameForm.elements[0];
      const selectedOption = grabSelectedOption(loadGameSelectElement); // either an option.value or undefined
      if (!selectedOption) {
        changeTextOfErrorById(
          "no-game-selected-error-message",
          "Please Select a Game to Delete"
        );
        showErrorById("no-game-selected-error-message");
        return;
      }
      // open the confirmation modal with modalContentContainer using all the data in utils for delete saved game confirmation modal
      const modalContent = createConfirmationModalContent(
        allModals.confirmationModalData.confirmDeleteSavedGame
      );
      confirmationModal.appendChild(modalContent);
      //* ADD THE CONFIRM DELETE SINGLE GAME EVENT LISTENER, since this element now exists on the DOM
      document
        .getElementById("confirm-delete-saved-game-button")
        .addEventListener("click", () => {
          // remove the game whose name matches the selected option from localStorage
          const allSavedGames = JSON.parse(
            window.localStorage.getItem("savedGames")
          );
          const nameOfGameToDelete = selectedOption;
          const indexOfGameToDelete = allSavedGames.findIndex((savedGame) => {
            return savedGame.nameOfGame === nameOfGameToDelete;
          });
          // splice out the game to delete, modifying the array allSavedGames
          allSavedGames.splice(indexOfGameToDelete, 1);
          if (!allSavedGames.length) {
            // if splicing that game out made the array empty, remove the entire property savedGames from localStorage so we don't keep an empty array stored
            window.localStorage.removeItem("savedGames");
            // render the no saved games heading and hide the form on the loadGameModal
            toggleDisplayById("no-saved-games-heading", "load-game-form");
          } else {
            // if there are still games after deleting the one we just removed, put the remaining allSavedGames back into localStorage
            window.localStorage.setItem(
              "savedGames",
              JSON.stringify(allSavedGames)
            );
          }

          // remove the option whose name matches the game we just deleted from the select options on the loadGameForm
          removeSingleLoadGameOption(nameOfGameToDelete);

          // finally, close the modal on successful delete
          // TODO make a notification saying the game was successfully deleted that disappears after a setTimeout expires
          closeConfirmationModal(confirmationModal);
        });

      //* CANCEL AND CLOSE CONFIRMATION MODAL EVENT LISTENER
      document
        .getElementById("close-confirmation-modal-button")
        .addEventListener("click", () => {
          closeConfirmationModal(confirmationModal);
        });

      // * NOW open the modal
      removeErrorById("no-game-selected-error-message"); // clear any error state on the previous loadGameModal
      confirmationModal.showModal();
    });

  // delete all games event listener
  document
    .getElementById("delete-all-saved-games-button")
    .addEventListener("click", () => {
      const modalContent = createConfirmationModalContent(
        allModals.confirmationModalData.confirmDeleteAllSavedGames
      );
      confirmationModal.appendChild(modalContent);

      //* CONFIRM DELETE ALL GAMES EVENT LISTENER, since this button now lives on the DOM
      document
        .getElementById("confirm-delete-all-saved-games-button")
        .addEventListener("click", () => {
          // 1. remove the savedGames property from localStorage
          window.localStorage.removeItem("savedGames");
          // 2. remove all options from form
          removeLoadGameOptions();
          // 3. finally, check to see if this was the last game and if so, swap the display classes of the "load-game-form" and "no-saved-games-heading"
          toggleDisplayById("no-saved-games-heading", "load-game-form");
          // 4. close the modal on successful delete of all games
          // TODO make a notification saying all games were successfully deleted that disappears after a setTimeout expires
          closeConfirmationModal(confirmationModal);
        });

      //* CANCEL AND CLOSE CONFIRMATION MODAL EVENT LISTENER

      // close confirmationModal event listener
      document
        .getElementById("close-confirmation-modal-button")
        .addEventListener("click", () => {
          closeConfirmationModal(confirmationModal);
        });

      removeErrorById("no-game-selected-error-message"); // clear any error state on the previous loadGameModal
      confirmationModal.showModal();
    });

  // Keyboard Events

  // Event Listeners For Updating Game Controls and Closing loadGameModal From Main Menu
  window.addEventListener("keyup", (e) => {
    const keyName = e.key;
    const activeElement = document.activeElement;
    if (
      settingsInputIds.keyControlIds.includes(activeElement.getAttribute("id"))
    ) {
      activeElement.value = keyName;
      return;
    }
  });

  // window.addEventListener("keydown", (e) => {
  //   const keyName = e.key;
  //   if (keyName === "Escape") {
  //     if (!confirmationModal.open) {
  //       closeLoadGameModal(loadGameModal);
  //     } else {
  //       closeConfirmationModal(confirmationModal);
  //     }
  //   }
  // });

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
