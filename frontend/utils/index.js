import { createGameToLoadOption } from "../components/index.js";

// Game Grid Values
export const NUM_ROWS = 18;
export const NUM_COLS = 10;
export const GRID_SPACE = 20;

// Available Shapes
export const availableShapes = [
  "line",
  "square",
  "tShape",
  "lShape",
  "jShape",
  "sShape",
  "zShape",
];

// Shape Colors
export const shapeColors = {
  green: "rgb(0 255 0)",
  blue: "rgb(0 100 255)",
  red: "rgb(255 0 0)",
  yellow: "rgb(255 255 0)",
  orange: "rgb(255 127 0)",
  pink: "rgb(255 0 255)",
  purple: "rgb(127 0 127)",
};

// Path Objects
const buttonsImgPathObj = {
  prefix: "/images/buttons/",
  suffix: ".png",
};

export const gameSoundsPathObj = {
  prefix: "/sounds/",
  suffix: ".mp3",
};

export const previewImgPathObj = {
  prefix: "/images/previews/",
  suffix: "-preview.png",
};

// Utility Functions
export const returnBody = () => {
  const bodyArrayFromCollection = Array.from(
    document.getElementsByTagName("body")
  );
  const body = bodyArrayFromCollection[0];
  return body;
};
export const generatePreviewImgPath = (shapeName) => {
  return `${previewImgPathObj.prefix}${shapeName}${previewImgPathObj.suffix}`;
};

const generateSoundPath = (soundEffect) => {
  return `${gameSoundsPathObj.prefix}${soundEffect}${gameSoundsPathObj.suffix}`;
};

// In Game Sounds Audio Objects
export const blockSound = new Audio(generateSoundPath("block-landing"));
export const rotateSound = new Audio(generateSoundPath("rotate"));
export const clearedRowSound = new Audio(generateSoundPath("cleared-row"));

// Modals with Respective Close Buttons
const allModals = {
  settingsModal: {
    closeButtonObj: {
      createButtonText: function (buttonText) {
        return buttonText;
      },
      classes: [],
      id: "close-settings-modal-button",
    },
    classes: ["settings-modal-container"],
    id: "settings-modal",
  },
  pauseModal: {
    closeButtonObj: {
      buttonText: "Return to Game",
      classes: [],
      id: "close-pause-modal-button",
      autofocus: true,
    },
    classes: ["modal-container"],
    id: "pause-modal",
  },
  loadGameModal: {
    closeButtonObj: {
      buttonText: "Cancel",
      classes: [],
      id: "close-load-game-modal-button",
    },
    classes: ["modal-container"],
    id: "load-game-modal",
  },
  saveGameModal: {
    closeButtonObj: {
      buttonText: "Cancel",
      classes: [],
      id: "close-save-game-modal-button",
    },
    classes: ["modal-container"],
    id: "save-game-modal",
  },
  confirmOverwriteGameModal: {
    classes: ["modal-container"],
    // * use this id to open the modal with utility function inside game.checkForSavedGame() if there is a match
    id: "confirm-overwrite-game-modal",
    confirmationText: {
      text: "Are you sure you want to overwrite this existing game?",
      classes: [],
    },
    confirmationButtonsObj: {
      containerClasses: [],
      confirm: {
        buttonText: "Yes, I'm sure",
        classes: [],
        // * use this id with an event listener in index.js to launch game.saveGame() and close the saveGameModal
        id: "confirm-overwrite-button",
      },
      deny: {
        buttonText: "No, Rename This Game",
        classes: [],
        // * use this id to close the modal with event listener in index.js, returning back to the saveGameModal
        id: "close-overwrite-game-modal-button",
      },
    },
  },
  confirmQuitGameModal: {
    classes: ["modal-container"],
    // * use this id to open the modal with an event listener in index.js listening for a click on the pause menu button called Quit Game
    id: "confirm-quit-game-modal",
    confirmationText: {
      text: "Are you sure you want to quit the current game?",
      classes: [],
    },
    confirmationButtonsObj: {
      containerClasses: [],
      confirm: {
        buttonText: "Yes, Return to Main Menu",
        classes: [],
        // * use this id with an event listener in index.js to launch game.quitGame() or just redirect the user to main menu
        id: "confirm-quit-game-button",
      },
      deny: {
        buttonText: "No, Return to Pause Screen",
        classes: [],
        // * use this id to close the modal with event listener in index.js
        id: "close-quit-game-modal-button",
      },
    },
  },
};

export const confirmOverwriteGame = () => {
  const overwriteGameModal = document.getElementById(
    "confirm-overwrite-game-modal"
  );
  overwriteGameModal.showModal();
};

// Destructure from allModals.settingsModal to access the createButtonText function and separate it from the remaining properties
const {
  closeButtonObj: { createButtonText, ...remainingButtonProps },
  ...remainingModalProps
} = allModals.settingsModal;

// Then, use the createButtonText function to make dynamic close modal button text, spreading in the remaining properties,
// for the two different settingsModals in the app
export const settingsModalInMainMenu = {
  closeButtonObj: {
    buttonText: createButtonText("Close Settings"),
    ...remainingButtonProps,
  },
  ...remainingModalProps,
};

export const settingsModalInGame = {
  closeButtonObj: {
    buttonText: createButtonText("Return to Pause Menu"),
    ...remainingButtonProps,
  },
  ...remainingModalProps,
};

export const pauseModalObj = allModals.pauseModal;

export const loadGameModalObj = allModals.loadGameModal;

export const saveGameModalObj = allModals.saveGameModal;

export const confirmOverwriteGameModalObj = allModals.confirmOverwriteGameModal;

export const confirmQuitGameModalObj = allModals.confirmQuitGameModal;

// Button Navigation Routes
const buttonNavRoutes = {
  mainMenu: "/",
  playGame: "/play-game",
  highScores: "/high-scores",
};

// Menu Button Containers
export const mainMenuButtonsContainerObj = {
  elementName: "div",
  classes: ["menu-buttons"],
};

export const postGameMenuButtonsContainerObj = {
  elementName: "div",
  classes: ["menu-buttons", "no-display"],
  id: "post-game-menu-buttons",
};

export const pauseMenuButtonsContainerObj = mainMenuButtonsContainerObj;

// Menu Buttons
const allMenuButtonObjs = {
  startGame: { buttonText: "Start Game", navLink: buttonNavRoutes.playGame },
  viewHighScores: {
    buttonText: "View High Scores",
    navLink: buttonNavRoutes.highScores,
  },
  openSettings: {
    buttonText: "Settings",
    id: "open-settings-modal-button",
  },
  newGame: { navLink: buttonNavRoutes.playGame, buttonText: "New Game" },
  saveGame: { buttonText: "Save Game", id: "open-save-game-modal-button" },
  loadGame: { buttonText: "Load a Game", id: "open-load-game-modal-button" },
  quitGame: {
    buttonText: "Quit Game",
    id: "open-confirm-quit-game-modal-button",
  },
  createMainMenuObj: function (buttonText) {
    return {
      navLink: buttonNavRoutes.mainMenu,
      buttonText: buttonText,
    };
  },
};

export const mainMenuButtonObjs = [
  allMenuButtonObjs.newGame,
  allMenuButtonObjs.loadGame,
  allMenuButtonObjs.viewHighScores,
  allMenuButtonObjs.openSettings,
];

export const highScoresMenuButtonObjs = [
  allMenuButtonObjs.newGame,
  allMenuButtonObjs.createMainMenuObj("Main Menu"),
];

export const postGameMenuButtonObjs = [
  allMenuButtonObjs.createMainMenuObj("Return to Main Menu"),
  allMenuButtonObjs.viewHighScores,
];

export const pauseMenuButtonObjs = [
  allModals.pauseModal.closeButtonObj,
  allMenuButtonObjs.saveGame,
  allMenuButtonObjs.openSettings,
  allMenuButtonObjs.quitGame,
];

// Game State Sub Headers
export const playGameSubHeaders = [
  { headerText: "Level: 0", id: "level-heading" },
  { headerText: "Score: 0", id: "total-score-heading" },
  { headerText: "Rows: 0", id: "rows-cleared-heading" },
];

// Game Controller Buttons
export const controllerRowObjs = {
  rowOne: [
    {
      id: "btn-up",
      imageSrc: `${buttonsImgPathObj.prefix}rotate${buttonsImgPathObj.suffix}`,
      imageAltText: "button to rotate shape clockwise",
    },
  ],
  rowTwo: [
    {
      id: "btn-left",
      imageSrc: `${buttonsImgPathObj.prefix}left-arrow${buttonsImgPathObj.suffix}`,
      imageAltText: "a button to move the piece to the left",
    },
    {
      id: "btn-pause",
      imageSrc: `${buttonsImgPathObj.prefix}pause-play${buttonsImgPathObj.suffix}`,
      imageAltText: "a button to toggle the play/pause state",
    },
    {
      id: "btn-right",
      imageSrc: `${buttonsImgPathObj.prefix}right-arrow${buttonsImgPathObj.suffix}`,
      imageAltText: "a button to move the piece to the right",
    },
  ],
  rowThree: [
    {
      id: "btn-down",
      imageSrc: `${buttonsImgPathObj.prefix}down-arrow${buttonsImgPathObj.suffix}`,
      imageAltText: "a button to soft drop the piece",
    },
  ],
};

// Key Control Values For Keydown Event Listeners
const keyControlPrefix = "key-control-";

// All Settings Input ID's
export const settingsInputIds = {
  radioIds: [
    "sound-fx-on",
    "sound-fx-off",
    "music-on",
    "music-off",
    "music-theme-one",
    "music-theme-two",
    "music-theme-three",
    "color-palette-classic",
    "color-palette-two",
    "color-palette-three",
  ],

  keyControlIds: [
    `${keyControlPrefix}rotate`,
    `${keyControlPrefix}move-left`,
    `${keyControlPrefix}move-right`,
    `${keyControlPrefix}soft-drop`,
    `${keyControlPrefix}toggle-pause`,
  ],
};

export const displayCurrentSettingsOnForm = (settingsObj) => {
  const arraysOfIds = Object.values(settingsInputIds);
  arraysOfIds.forEach((arrayOfIds) => {
    arrayOfIds.forEach((id) => {
      const currentInput = document.getElementById(id);
      const nameOfCurrentInput = currentInput.name;
      const typeOfInput = currentInput.type;
      if (typeOfInput === "radio") {
        const currentSetting = settingsObj[nameOfCurrentInput];
        if (currentSetting === currentInput.value) {
          currentInput.checked = true;
        }
      } else if (typeOfInput === "text") {
        const currentSetting = settingsObj.keyControls[nameOfCurrentInput];
        injectValueToInputById(currentInput.id, currentSetting);
      }
    });
  });
};

export const updateElementTextById = (id, newVal) => {
  const element = document.getElementById(id);
  element.innerText = newVal;
};

export const updateImageSrcById = (id, newSrc) => {
  const imageElement = document.getElementById(id);
  imageElement.src = newSrc;
};

export const toggleDisplayById = (...ids) => {
  ids.forEach((id) => {
    const element = document.getElementById(id);
    element.classList.toggle("no-display");
  });
};

export const injectValueToInputById = (id, valueToInject) => {
  const element = document.getElementById(id);
  element.value = valueToInject;
};

export const grabInputValuesFromForm = (formElement) => {
  const inputs = formElement.elements;
  const inputsFromForm = { keyControls: {} };

  for (const input of inputs) {
    if (input.type === "submit" || input.type === "fieldset") {
      continue;
    }
    const inputName = input.name;
    const inputVal = input.value;

    if (input.type === "radio") {
      if (input.checked) {
        inputsFromForm[inputName] = inputVal;
      }
    } else {
      inputsFromForm.keyControls[inputName] = inputVal;
    }
  }
  return inputsFromForm;
};

export const verifyUniqueStrings = (strArray) => {
  const CHAR_MAP = {};
  for (const str of strArray) {
    if (CHAR_MAP[str]) return false;
    CHAR_MAP[str] = true;
  }
  return true;
};

export const showErrorById = (errorId) => {
  const errorMessage = document.getElementById(errorId);
  errorMessage.classList.remove("no-display");
};

const removeErrorById = (errorId) => {
  const errorMessage = document.getElementById(errorId);
  errorMessage.classList.add("no-display");
};

export const openSettingsModal = (settingsObj, settingsModal) => {
  displayCurrentSettingsOnForm(settingsObj);
  removeErrorById("settings-error-message");
  settingsModal.showModal();
};

export const closeSettingsModal = (settingsModal) => {
  settingsModal.close();
};

const getNamesOfAllSavedGames = () => {
  const namesOfAllSavedGames = JSON.parse(
    localStorage.getItem("savedGames")
  ).map((savedGame) => savedGame.nameOfGame);
  return namesOfAllSavedGames;
};

export const openLoadGameModal = (loadGameModal) => {
  const namesOfAllSavedGames = getNamesOfAllSavedGames();
  const selectInput = document.getElementById("load-game-select");
  namesOfAllSavedGames.forEach((nameOfSavedGame) => {
    selectInput.appendChild(createGameToLoadOption(nameOfSavedGame));
  });
  removeErrorById("no-game-selected-error-message");
  loadGameModal.showModal();
};

export const closeLoadGameModal = (loadGameModal) => {
  const allExistingGameLoadOptions = Array.from(
    document.getElementsByClassName("game-to-load-select-option")
  );
  allExistingGameLoadOptions.forEach((gameLoadOption) => {
    gameLoadOption.remove();
  });
  loadGameModal.close();
};

export const grabSelectedOption = (selectElement) => {
  const indexOfSelectedOption = selectElement.selectedIndex;
  // return if the option selected is the dropdown instructions
  if (indexOfSelectedOption === 0) return;
  const selectedOption = selectElement[indexOfSelectedOption].value;
  return selectedOption;
};

export const updateSettingsFormData = {
  settingsOptions: {
    musicOnOff: {
      fieldSetOptions: {
        fieldSetId: "music-on-off",
        containerClasses: [],
        legendText: "Music",
        legendClasses: [],
      },
      radioOptions: [
        {
          containerClasses: ["radio-option"],
          labelText: "On",
          input: { id: "music-on", type: "radio", name: "music", value: "on" },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "Off",
          input: {
            id: "music-off",
            type: "radio",
            name: "music",
            value: "off",
          },
        },
      ],
    },
    musicSelect: {
      fieldSetOptions: {
        fieldSetId: "music-select",
        containerClasses: [],
        legendText: "Select Game Music",
        legendClasses: [],
      },
      radioOptions: [
        {
          containerClasses: ["radio-option"],
          labelText: "Theme One",
          input: {
            id: "music-theme-one",
            type: "radio",
            name: "gameMusicSelection",
            value: "theme-1",
          },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "Theme Two",
          input: {
            id: "music-theme-two",
            type: "radio",
            name: "gameMusicSelection",
            value: "theme-2",
          },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "Theme Three",
          input: {
            id: "music-theme-three",
            type: "radio",
            name: "gameMusicSelection",
            value: "theme-3",
          },
        },
      ],
    },
    colorPaletteSelect: {
      fieldSetOptions: {
        fieldSetId: "color-palette-select",
        containerClasses: [],
        legendText: "Select Color Palette",
        legendClasses: [],
      },
      radioOptions: [
        {
          containerClasses: ["radio-option"],
          labelText: "Classic",
          input: {
            id: "color-palette-classic",
            type: "radio",
            name: "colorPaletteSelection",
            value: "classic",
          },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "Two",
          input: {
            id: "color-palette-two",
            type: "radio",
            name: "colorPaletteSelection",
            value: "two",
          },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "Three",
          input: {
            id: "color-palette-three",
            type: "radio",
            name: "colorPaletteSelection",
            value: "three",
          },
        },
      ],
    },
    keyControls: {
      rotate: {
        containerClasses: [],
        labelText: "Rotate Shape",
        input: {
          id: "key-control-rotate",
          type: "text",
          name: "rotate",
          required: true,
        },
      },
      moveLeft: {
        containerClasses: [],
        labelText: "Move Left",
        input: {
          id: "key-control-move-left",
          type: "text",
          name: "moveLeft",
          required: true,
        },
      },
      moveRight: {
        containerClasses: [],
        labelText: "Move Right",
        input: {
          id: "key-control-move-right",
          type: "text",
          name: "moveRight",
          required: true,
        },
      },
      softDrop: {
        containerClasses: [],
        labelText: "Soft Drop Shape",
        input: {
          id: "key-control-soft-drop",
          type: "text",
          name: "softDrop",
          required: true,
        },
      },
      togglePause: {
        containerClasses: [],
        labelText: "Pause/Unpause Game",
        input: {
          id: "key-control-toggle-pause",
          type: "text",
          name: "togglePause",
          required: true,
        },
      },
    },
    soundFxOnOff: {
      fieldSetOptions: {
        fieldSetId: "sound-fx-on-off",
        containerClasses: [],
        legendText: "Sound FX",
        legendClasses: [],
      },
      radioOptions: [
        {
          containerClasses: ["radio-option"],
          labelText: "On",
          input: {
            id: "sound-fx-on",
            type: "radio",
            name: "soundFx",
            value: "on",
          },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "Off",
          input: {
            id: "sound-fx-off",
            type: "radio",
            name: "soundFx",
            value: "off",
          },
        },
      ],
    },
  },
  submitButtonText: "Apply Settings",
};

export const highScoresFormData = {
  formContainerClasses: ["player-name-form", "no-display"],
  formContainerId: "player-name-form",
  playerName: {
    containerClasses: [],
    labelText: "Enter your name",
    input: {
      id: "player-name",
      type: "text",
      name: "playerName",
      required: true,
      maxLength: 18,
    },
  },
  playerScore: {
    containerClasses: ["player-score-container"],
    labelText: "Your Score",
    input: {
      id: "player-score",
      type: "text",
      name: "playerScore",
      readonly: true,
    },
  },
};

export const loadGameFormData = {
  formContainerClasses: [],
  formContainerId: "load-game-form",
  inputs: [
    {
      inputName: "loadGameSelect",
      labelText: "Select a Game To Load",
      containerClasses: [],
      labelClasses: [],
      inputClasses: [],
      input: {
        id: "load-game-select",
        name: "gameToLoad",
      },
    },
  ],
  submitButton: {
    id: "",
    classes: [],
    buttonText: "Load Selected Game",
  },
  errors: [
    {
      message: "Please Select a Game To Load",
      id: "no-game-selected-error-message",
    },
  ],
};

export const saveGameFormData = {
  formContainerClasses: [],
  formContainerId: "save-game-form",
  inputs: [
    {
      inputName: "saveGameText",
      labelText: "Enter a Name For This Game",
      containerClasses: [],
      labelClasses: [],
      inputClasses: [],
      input: {
        id: "name-of-game-to-save",
        type: "text",
        name: "gameToSave",
        required: true,
      },
    },
  ],
  submitButton: {
    id: "",
    classes: [],
    buttonText: "Save Game",
  },
};

export const highScoresTableFields = ["No.", "Player", "Score"];
