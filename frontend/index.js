import {
  createContainer,
  createCustomHeading,
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
} from "./utils/index.js";

// Build out the UI
const body = returnBody();
const mainMenuContainer = createContainer(
  "main",
  ["main-container", "main-menu-container"],
  "main-menu-container"
);
const settingsModal = createSettingsModal("Return to Main Menu");

body.prepend(
  createCustomHeading("h1", "Main Menu", ["main-heading"], "main-heading"),
  mainMenuContainer,
  settingsModal
);

const mainMenuButtons = createMenuButtons(
  menuButtonsContainerObj,
  mainMenuButtonObjs
);
mainMenuContainer.appendChild(mainMenuButtons);

// Instantiate a Settings object
const settingsObj = new Settings();

// Add Event Listeners
document.getElementById("open-modal-button").addEventListener("click", () => {
  openSettingsModal(settingsObj, settingsModal);
});

document.getElementById("close-modal-button").addEventListener("click", () => {
  closeSettingsModal(settingsModal);
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
});

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
