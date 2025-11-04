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
  closeLoadGameModal,
  grabSelectedOption,
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

// This should now navigate the user to /play-game, which will check for and pull a gameToLoad key/value pair inside window.sessionStorage.
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
  closeLoadGameModal(loadGameModal);
  window.location.assign("/play-game");
});

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
    openLoadGameModal(loadGameModal);
  });

document
  .getElementById("close-load-game-modal-button")
  .addEventListener("click", () => {
    closeLoadGameModal(loadGameModal);
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

  if (keyName === "Escape") {
    closeLoadGameModal(loadGameModal);
  }
});
