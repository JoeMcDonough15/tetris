import {
  createCustomHeading,
  createMainContainer,
  createMenuButton,
  createNavButtons,
  createSettingsModal,
} from "./components/index.js";
import Settings from "./settings.js";

const bodyArrayFromCollection = Array.from(
  document.getElementsByTagName("body")
);
const body = bodyArrayFromCollection[0];
const mainMenuContainer = createMainContainer("main-menu-container");
const settingsModal = createSettingsModal("Return to Main Menu");

body.prepend(
  createCustomHeading("h1", "Main Menu", "main-header"),
  mainMenuContainer,
  settingsModal
);

const navButtons = [
  { navDestination: "/play-game", buttonText: "Start Game" },
  { navDestination: "/high-scores", buttonText: "View High Scores" },
];

const settingsButton = {
  buttonText: "Settings",
  clickEventFunction: () => {
    settingsModal.showModal();
  },
};

const mainMenuButtonsContainer = document.createElement("div");
mainMenuButtonsContainer.classList.add("main-menu-buttons");

mainMenuButtonsContainer.append(
  createNavButtons(...navButtons),
  createMenuButton(settingsButton)
);

mainMenuContainer.appendChild(mainMenuButtonsContainer);

const updateSettingsForm = document.getElementById("update-settings-form");
const settingsObj = new Settings(settingsModal, updateSettingsForm);
settingsObj.listenForSettingsUpdates(); // add the event listener to the form for submission
