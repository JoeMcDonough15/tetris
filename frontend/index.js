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
  keyControlPrefix,
  validKeySelectInputIds,
  displayCurrentSettingsOnForm,
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
  menuButtonsContainerObj,
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

// Instantiate a Settings object
const updateSettingsForm = document.getElementById("update-settings-form");
const settingsObj = new Settings(settingsModal, updateSettingsForm);

// // Target Radio Inputs to Set Values Based on Settings Object
// const soundFxOnRadio = document.getElementById("sound-fx-on");
// const soundFxOffRadio = document.getElementById("sound-fx-off");
// const musicOnRadio = document.getElementById("music-on");
// const musicOffRadio = document.getElementById("music-off");
// const musicThemeOneRadio = document.getElementById("music-theme-one");
// const musicThemeTwoRadio = document.getElementById("music-theme-two");
// const musicThemeThreeRadio = document.getElementById("music-theme-three");
// const colorPaletteClassicRadio = document.getElementById(
//   "color-palette-classic"
// );
// const colorPaletteTwoRadio = document.getElementById("color-palette-two");
// const colorPaletteThreeRadio = document.getElementById("color-palette-three");

// // Key Controller Inputs to Set Values Based on Settings Object
// const keyControlRotateInput = document.getElementById("key-control-rotate");
// const keyControlMoveLeftInput = document.getElementById("key-control-rotate");
// const keyControlMoveRightInput = document.getElementById("key-control-rotate");
// const keyControlSoftDropInput = document.getElementById("key-control-rotate");
// const keyControlTogglePauseInput =
//   document.getElementById("key-control-rotate");

// Event Listeners For Updating Game Controls From Main Menu
window.addEventListener("keyup", (e) => {
  const keyName = e.key;
  const activeElement = document.activeElement;
  if (!validKeySelectInputIds.includes(activeElement.getAttribute("id"))) {
    return;
  }

  activeElement.value = keyName;
});
