import {
  createConfirmationModal,
  createConfirmationModalContent,
  createContainer,
  createCustomHeading,
  createLoadGameModal,
  createMenuButtons,
  createReusableConfirmationModal,
  createSettingsModal,
} from "./components/index.js";
import Settings from "./settings.js";
import {
  mainMenuButtonsContainerObj,
  mainMenuButtonObjs,
  returnBody,
  settingsInputIds,
  openSettingsModal,
  closeSettingsModal,
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
} from "./utils/index.js";

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

// Instantiate a Settings object
const settingsObj = new Settings();

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
  closeSettingsModal(settingsModal);
});

const loadGameForm = document.getElementById("load-game-form");
loadGameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const loadGameSelectElement = loadGameForm.elements[0];
  const selectedOption = grabSelectedOption(loadGameSelectElement); // either an option.value or undefined
  if (!selectedOption) {
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
    closeSettingsModal(settingsModal);
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
    // open the confirmation modal with modalContentContainer using all the data in utils for delete saved game confirmation modal
    const modalContent = createConfirmationModalContent(
      allModals.confirmationModalData.confirmDeleteSavedGame
    );
    confirmationModal.appendChild(modalContent);
    //* ADD THE CONFIRM DELETE SINGLE GAME EVENT LISTENER, since this element now exists on the DOM
    document
      .getElementById("confirm-delete-saved-game-button")
      .addEventListener("click", () => {
        const loadGameSelectElement = loadGameForm.elements[0];
        const selectedOption = grabSelectedOption(loadGameSelectElement); // either an option.value or undefined
        if (!selectedOption) {
          showErrorById("no-game-selected-error-message");
          return;
        }

        // 1. remove the game whose name matches the selected option from localStorage
        const allSavedGames = JSON.parse(
          window.localStorage.getItem("savedGames")
        );
        const nameOfGameToDelete = selectedOption.value;
        const indexOfGameToDelete = allSavedGames.findIndex((savedGame) => {
          return savedGame.nameOfGame === nameOfGameToDelete;
        });
        // splice out the game to delete, modifying the array allSavedGames
        allSavedGames.splice(indexOfGameToDelete, 1);
        // put allSavedGames back into localStorage at the property savedGames
        window.localStorage.setItem("savedGames", allSavedGames);

        // 2. remove the option whose name matches the game we just deleted from the select options on the loadGameForm
        removeSingleLoadGameOption(nameOfGameToDelete);

        // 3. finally, check to see if this was the last game and if so, swap the display classes of the "load-game-form" and "no-saved-games-heading"
        if (!allSavedGames.length) {
          toggleDisplayById("no-saved-games-heading", "load-game-form");
        }
      });

    //* CANCEL AND CLOSE CONFIRMATION MODAL EVENT LISTENER

    // close confirmationModal event listener
    document
      .getElementById("close-confirmation-modal-button")
      .addEventListener("click", () => {
        closeConfirmationModal(confirmationModal);
      });

    // * NOW open the modal
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
      });

    //* CANCEL AND CLOSE CONFIRMATION MODAL EVENT LISTENER

    // close confirmationModal event listener
    document
      .getElementById("close-confirmation-modal-button")
      .addEventListener("click", () => {
        closeConfirmationModal(confirmationModal);
      });

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

window.addEventListener("keydown", (e) => {
  const keyName = e.key;
  if (keyName === "Escape") {
    if (!confirmationModal.open) {
      closeLoadGameModal(loadGameModal);
    } else {
      closeConfirmationModal(confirmationModal);
    }
  }
});
