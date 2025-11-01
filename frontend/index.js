import {
  createContainer,
  createCustomHeading,
  createMenuButtons,
  createSettingsModal,
} from "./components/index.js";
import Settings from "./settings.js";
import {
  mainMenuButtonObjs,
  mainMenuButtonsContainerObj,
  returnBody,
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
  createCustomHeading("h1", "Main Menu", "main-heading"),
  mainMenuContainer,
  settingsModal
);

const mainMenuButtons = createMenuButtons(
  mainMenuButtonsContainerObj,
  mainMenuButtonObjs
);
mainMenuContainer.appendChild(mainMenuButtons);

// Add Event Listeners
document.getElementById("open-modal-button").addEventListener("click", () => {
  settingsModal.showModal();
});
document.getElementById("close-modal-button").addEventListener("click", () => {
  settingsModal.close();
});

// Target the updateSettingsForm and instantiate a Settings object for changing settings
const updateSettingsForm = document.getElementById("update-settings-form");
new Settings(settingsModal, updateSettingsForm);
