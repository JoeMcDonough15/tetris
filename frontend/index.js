import {
  createContainer,
  createCustomHeading,
  createLoadGameModal,
  createMenuButtons,
  createSettingsModal,
} from "./components/index.js";
import Settings from "./settings.js";
import {
  menuButtonsContainerObj,
  mainMenuButtonObjs,
  returnBody,
  settingsInputIds,
  openSettingsModal,
  closeSettingsModal,
  grabInputValuesFromForm,
  verifyUniqueStrings,
  showErrorById,
  openLoadGameModal,
} from "./utils/index.js";

// Build out the UI
const body = returnBody();
const mainMenuContainer = createContainer(
  "main",
  ["main-container", "main-menu-container"],
  "main-menu-container"
);
const settingsModal = createSettingsModal("Return to Main Menu");
const loadGameModal = createLoadGameModal("Cancel");

body.prepend(
  createCustomHeading("h1", "Main Menu", ["main-heading"], "main-heading"),
  mainMenuContainer,
  settingsModal,
  loadGameModal
);

const mainMenuButtons = createMenuButtons(
  menuButtonsContainerObj,
  mainMenuButtonObjs
);
mainMenuContainer.appendChild(mainMenuButtons);

// Instantiate a Settings object
const settingsObj = new Settings();

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

// * 3. Set a submit event listener for the loadGamesForm
// When the user submits the form, the name of the selected game gets sent to window.sessionStorage as gameToLoad key set to the value of
// the name of the game that was collected from the form's select/drop down menu.
// window.sessionStorage.setItem(JSON.stringify( { gameToLoad: nameOfGameToLoadFromForm }  ))
// This should now navigate the user to /play-game, which will check for and pull a gameToLoad key/value pair inside window.sessionStorage.

// Mouse Events
// Add Event Listeners
document.getElementById("open-modal-button").addEventListener("click", () => {
  openSettingsModal(settingsObj, settingsModal);
});

document.getElementById("close-modal-button").addEventListener("click", () => {
  closeSettingsModal(settingsModal);
});

document
  .getElementById("open-load-game-modal-button")
  .addEventListener("click", () => {
    // write a function called openLoadGameModal(loadGameModal).
    openLoadGameModal(loadGameModal);
    // This function should include a helper function that fetches all saved games from local storage and returns an array of the game names
    // Then it calls another helper function that places all of those options on the form's dropdown/select container with a class name of "game-to-load-select-option".
    // Then it should open the modal that was passed in.
  });

document
  .getElementById("close-load-game-modal-button")
  .addEventListener("click", () => {
    // write a function called closeLoadGameModal(loadGameModal).
    // This function should include a helper function that grabs all elements by class name "game-to-load-select-option" and calls .remove() on each of the elements in the collection.
    // Then it should close the modal that was passed in.
  });

// * 2. Set a click event listener on the Load Game button.
// This event listener should call showModal(loadGameModal), which opens a dialog called loadGameModal that displays a form called loadGamesForm.  The form should have a select/drop down menu.
// This form displays all the names of games from localStorage that can be loaded.
// once the user selects a game and clicks "Load This Game", the form submits.

// Keyboard Events

// Event Listeners For Updating Game Controls From Main Menu
window.addEventListener("keyup", (e) => {
  const keyName = e.key;
  const activeElement = document.activeElement;
  if (
    settingsInputIds.keyControlIds.includes(activeElement.getAttribute("id"))
  ) {
    activeElement.value = keyName;
  }
});
