import {
  createContainer,
  createCustomHeading,
  createErrorMessage,
  createMenuButtons,
  createSettingsModal,
} from "./components/index.js";
import Settings from "./settings.js";
import {
  menuButtonsContainerObj,
  mainMenuButtonObjs,
  returnBody,
  settingsInputIds,
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

// const settingsObj = new Settings(settingsModal, updateSettingsForm);
const settingsObj = new Settings();

// Add Event Listeners
document.getElementById("open-modal-button").addEventListener("click", () => {
  displayCurrentSettingsOnForm(settingsObj);
  // TODO remove  "settings-error-message" if it exists
  settingsModal.showModal();
});

document.getElementById("close-modal-button").addEventListener("click", () => {
  settingsModal.close();
});

const updateSettingsForm = document.getElementById("update-settings-form");
updateSettingsForm.addEventListener("submit", (e) => {
  console.log("running inside handle submit");
  e.preventDefault();
  // grab elements from form
  const updateSoundFxOnOff = updateSettingsForm.elements.soundFx.value;
  const updateMusicOnOff = updateSettingsForm.elements.music.value;
  const updateGameMusicSelection =
    updateSettingsForm.elements.gameMusicSelection.value;
  const updateColorPaletteSelection =
    updateSettingsForm.elements.colorPaletteSelection.value;
  const updateRotateControl = updateSettingsForm.elements.rotate.value;
  const updateMoveLeft = updateSettingsForm.elements.moveLeft.value;
  const updateMoveRight = updateSettingsForm.elements.moveRight.value;
  const updateSoftDrop = updateSettingsForm.elements.softDrop.value;
  const updateTogglePause = updateSettingsForm.elements.togglePause.value;
  const updatedKeyControlValues = [
    updateRotateControl,
    updateMoveLeft,
    updateMoveRight,
    updateSoftDrop,
    updateTogglePause,
  ];

  // helper function to verify unique inputs for key controls
  const verifyUniqueKeyControls = (newKeyControls) => {
    const CHAR_MAP = {};
    for (const newKey of newKeyControls) {
      if (CHAR_MAP[newKey]) return false;
      CHAR_MAP[newKey] = true;
    }
    return true;
  };

  // add error to form and return early if verification failed
  if (!verifyUniqueKeyControls(updatedKeyControlValues)) {
    const error = createErrorMessage("settings-error-message");
    updateSettingsForm.append(error);
    return;
  }

  // update settings
  settingsObj.updateSettings({
    updateSoundFxOnOff,
    updateMusicOnOff,
    updateGameMusicSelection,
    updateColorPaletteSelection,
    updatedKeyControlValues,
  });
  // close modal
  settingsModal.close();
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
