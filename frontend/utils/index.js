import {
  createConfirmationModalContent,
  createGameToLoadOption,
} from "../components/index.js";

// * Game Grid Values
export const NUM_ROWS = 18;
export const NUM_COLS = 10;
export const GRID_SPACE = 20;

// * Available Shapes
export const availableShapes = [
  "line",
  "square",
  "tShape",
  "lShape",
  "jShape",
  "sShape",
  "zShape",
];

// * Shape Colors
export const shapeColors = {
  green: "rgb(0 255 0)",
  blue: "rgb(0 100 255)",
  red: "rgb(255 0 0)",
  yellow: "rgb(255 255 0)",
  orange: "rgb(255 127 0)",
  pink: "rgb(255 0 255)",
  purple: "rgb(127 0 127)",
};

// * Path Objects
const buttonsImgPathObj = {
  prefix: "/images/buttons/",
  suffix: ".png",
};

const gameSoundsPathObj = {
  prefix: "/sounds/",
  suffix: ".mp3",
};

const previewImgPathObj = {
  prefix: "/images/previews/",
  suffix: "-preview.png",
};

const gameMusicPathObj = {
  prefix: "/music/",
  suffix: ".mp3",
};

// * Utility Functions
export const returnBody = () => {
  const bodyArrayFromCollection = Array.from(
    document.getElementsByTagName("body")
  );
  const body = bodyArrayFromCollection[0];
  return body;
};
const generatePreviewImgPath = (shapeName) => {
  return `${previewImgPathObj.prefix}${shapeName}${previewImgPathObj.suffix}`;
};

const generateSoundPath = (soundEffect) => {
  return `${gameSoundsPathObj.prefix}${soundEffect}${gameSoundsPathObj.suffix}`;
};

export const generateMusicPath = (themeName) => {
  return `${gameMusicPathObj.prefix}${themeName}${gameMusicPathObj.suffix}`;
};

// * In Game Sounds Audio Objects
export const blockSound = new Audio(generateSoundPath("block-landing"));
export const rotateSound = new Audio(generateSoundPath("rotate"));
export const clearedRowSound = new Audio(generateSoundPath("cleared-row"));

// * Modals with Respective Close Buttons
export const allModals = {
  settingsModal: {
    closeButtonObj: {
      classes: [],
      id: "close-settings-modal-button",
    },
    classes: ["modal-container", "settings-modal-container"],
    id: "settings-modal",
  },
  pauseModal: {
    closeButtonObj: {
      buttonText: "Return to Game",
      classes: [],
      id: "close-pause-modal-button",
      autofocus: true,
    },
    classes: ["modal-container", "modal-container"],
    id: "pause-modal",
  },
  loadGameModal: {
    closeButtonObj: {
      buttonText: "Cancel",
      classes: [],
      id: "close-load-game-modal-button",
    },
    classes: ["modal-container", "load-game-modal-container"],
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
  confirmationModalData: {
    confirmDeleteSavedGame: {
      containerClasses: [],
      containerId: "confirm-delete-saved-game-modal-content",
      confirmationTextObj: {
        // innerText set dynamically so we can include the name of the game to delete
        classes: [],
        id: "confirm-delete-game-modal-text",
      },
      confirmationButtonsObj: {
        containerClasses: [],
        buttonObjs: [
          {
            buttonName: "confirm",
            buttonText: "Yes, Delete This Game",
            classes: [],
            id: "confirm-delete-saved-game-button",
          },
          {
            buttonName: "deny",
            buttonText: "Cancel",
            classes: [],
            id: "close-confirmation-modal-button",
          },
        ],
      },
    },
    confirmDeleteAllSavedGames: {
      containerClasses: [],
      containerId: "confirm-delete-all-saved-games-modal-content",
      confirmationTextObj: {
        text: "Are you sure you want to delete all saved games?",
        classes: [],
        id: "confirm-delete-game-modal-text",
      },
      confirmationButtonsObj: {
        containerClasses: [],
        buttonObjs: [
          {
            buttonName: "confirm",
            buttonText: "Yes, Delete All My Saved Games",
            classes: [],
            id: "confirm-delete-all-saved-games-button",
          },
          {
            buttonName: "deny",
            buttonText: "Cancel",
            classes: [],
            id: "close-confirmation-modal-button",
          },
        ],
      },
    },
    confirmOverwriteSavedGame: {
      containerClasses: [],
      containerId: "confirm-overwrite-saved-game-modal-content",
      confirmationTextObj: {
        classes: [],
        id: "confirm-overwrite-game-modal-text",
        // innerText set dynamically so it can include name of game to overwrite
      },
      confirmationButtonsObj: {
        containerClasses: [],
        buttonObjs: [
          {
            buttonName: "confirm",
            buttonText: "Yes, Overwrite This Game",
            classes: [],
            id: "confirm-overwrite-button",
          },
          ,
          {
            buttonName: "deny",
            buttonText: "No, Rename This Game",
            classes: [],
            id: "close-confirmation-modal-button",
          },
        ],
      },
    },
    confirmQuitGame: {
      containerClasses: [],
      containerId: "confirm-quit-game-modal-content",
      confirmationTextObj: {
        text: "Are you sure you want to quit the current game?",
        classes: [],
        id: "confirm-quit-game-modal-text",
      },
      confirmationButtonsObj: {
        containerClasses: [],
        buttonObjs: [
          {
            buttonName: "confirm",
            buttonText: "Yes, Return to Main Menu",
            classes: [],
            id: "confirm-quit-game-button",
          },
          {
            buttonName: "deny",
            buttonText: "No, Return to Pause Screen",
            classes: [],
            id: "close-confirmation-modal-button",
          },
        ],
      },
    },
  },
};

const {
  closeButtonObj: { ...buttonClassesAndIds },
  ...remainingModalProps
} = allModals.settingsModal;

export const settingsModalInMainMenuObj = {
  closeButtonObj: {
    buttonText: "Close Settings",
    ...buttonClassesAndIds,
  },
  ...remainingModalProps,
};

export const settingsModalInGameObj = {
  closeButtonObj: {
    buttonText: "Return to Pause Menu",
    ...buttonClassesAndIds,
  },
  ...remainingModalProps,
};

export const pauseModalObj = allModals.pauseModal;

export const loadGameModalObj = allModals.loadGameModal;

export const saveGameModalObj = allModals.saveGameModal;

export const confirmOverwriteGameModalObj = allModals.confirmOverwriteGameModal;

export const confirmQuitGameModalObj = allModals.confirmQuitGameModal;

export const openConfirmOverwriteGameModal = (tetrisClass) => {
  const confirmationModal = document.getElementById("confirmation-modal");
  const modalContent = createConfirmationModalContent(
    allModals.confirmationModalData.confirmOverwriteSavedGame
  );
  confirmationModal.appendChild(modalContent);
  const overwriteGameModalText = document.getElementById(
    "confirm-overwrite-game-modal-text"
  );
  overwriteGameModalText.innerText = `Clicking save will overwrite game: ${tetrisClass.nameOfGameToSave}. Are you sure you want to continue?`;

  document.getElementById("confirm-overwrite-button").addEventListener(
    "click",
    () => {
      tetrisClass.saveGame();
      closeConfirmationModal();
    },
    { once: true }
  );

  document.getElementById("close-confirmation-modal-button").addEventListener(
    "click",
    () => {
      closeConfirmationModal();
    },
    { once: true }
  );

  confirmationModal.showModal();
};

// * Menu Button Containers
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

// * Menu Buttons
const allMenuButtonObjs = {
  newGame: { navButton: true, buttonText: "New Game", id: "new-game-button" },
  viewHighScores: {
    buttonText: "View High Scores",
    navButton: true,
    id: "view-high-scores-button",
  },
  openSettings: {
    buttonText: "Settings",
    id: "open-settings-modal-button",
    navButton: false,
  },
  saveGame: {
    buttonText: "Save Game",
    navButton: false,
    id: "open-save-game-modal-button",
  },
  loadGame: {
    buttonText: "Load a Game",
    navButton: false,
    id: "open-load-game-modal-button",
  },
  quitGame: {
    navButton: false,
    buttonText: "Quit Game",
    id: "open-confirm-quit-game-modal-button",
  },
  mainMenu: {
    navButton: true,
    id: "main-menu-button",
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
  { ...allMenuButtonObjs.mainMenu, buttonText: "Main Menu" },
];

export const postGameMenuButtonObjs = [
  { ...allMenuButtonObjs.mainMenu, buttonText: "Return to Main Menu" },
  allMenuButtonObjs.viewHighScores,
];

export const pauseMenuButtonObjs = [
  allModals.pauseModal.closeButtonObj,
  allMenuButtonObjs.saveGame,
  allMenuButtonObjs.openSettings,
  allMenuButtonObjs.quitGame,
];

// * Game State Sub Headers
export const playGameSubHeaders = [
  { headerText: "Level: 0", id: "level-heading" },
  { headerText: "Score: 0", id: "total-score-heading" },
  { headerText: "Rows: 0", id: "rows-cleared-heading" },
];

// * Game Controller Buttons
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

// * Key Control Values For Keydown Event Listeners
const keyControlPrefix = "key-control-";

// * All Settings Input ID's
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

export const updateImageSrcById = (id, shapeName) => {
  const newSrc = generatePreviewImgPath(shapeName);
  const imageElement = document.getElementById(id);
  imageElement.src = newSrc;
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

export const showElementById = (...ids) => {
  ids.forEach((id) => {
    const element = document.getElementById(id);
    element.classList.remove("no-display");
  });
};

export const hideElementById = (...ids) => {
  ids.forEach((id) => {
    const element = document.getElementById(id);
    element.classList.add("no-display");
  });
};

export const toggleDisplayById = (...ids) => {
  ids.forEach((id) => {
    const element = document.getElementById(id);
    element.classList.toggle("no-display");
  });
};

export const showErrorById = (errorId) => {
  const errorMessage = document.getElementById(errorId);
  errorMessage.classList.remove("no-display");
};

export const removeErrorById = (errorId) => {
  const errorMessage = document.getElementById(errorId);
  errorMessage.classList.add("no-display");
};

export const changeTextOfErrorById = (errorId, message) => {
  const errorMessage = document.getElementById(errorId);
  errorMessage.innerText = message;
};

export const openSettingsModal = (settingsObj, settingsModal) => {
  displayCurrentSettingsOnForm(settingsObj);
  removeErrorById("settings-error-message");
  settingsModal.showModal();
};

const getNamesOfAllSavedGames = () => {
  const savedGames = JSON.parse(localStorage.getItem("savedGames"));
  if (!savedGames) return;
  return savedGames.map((savedGame) => savedGame.nameOfGame);
};

const addSavedGamesToDropdown = (namesOfAllSavedGames) => {
  const dropDownMenuOfSavedGames = document.getElementById("load-game-select");
  namesOfAllSavedGames.forEach((nameOfSavedGame) => {
    dropDownMenuOfSavedGames.appendChild(
      createGameToLoadOption(nameOfSavedGame)
    );
  });
};

export const handleUpdateSavedGameTextInput = () => {
  const savedGamesDropdownMenu = document.getElementById("load-game-select");
  const selectedValue = grabSelectedOption(savedGamesDropdownMenu);
  injectValueToInputById(
    "name-of-game-to-save",
    selectedValue ? selectedValue : ""
  );
};

export const openSaveGameModal = () => {
  const saveGameModal = document.getElementById("save-game-modal");
  injectValueToInputById("name-of-game-to-save", "");
  const namesOfAllSavedGames = getNamesOfAllSavedGames();
  if (!namesOfAllSavedGames) {
    hideElementById("saved-games-dropdown-container");
  } else {
    addSavedGamesToDropdown(namesOfAllSavedGames);
    showElementById("saved-games-dropdown-container");
  }

  saveGameModal.showModal();
};

export const openLoadGameModal = () => {
  const loadGameModal = document.getElementById("load-game-modal");
  const namesOfAllSavedGames = getNamesOfAllSavedGames();
  if (!namesOfAllSavedGames) {
    showElementById("no-saved-games-heading");
    hideElementById("load-game-form");
  } else {
    showElementById("load-game-form");
    hideElementById("no-saved-games-heading");
    addSavedGamesToDropdown(namesOfAllSavedGames);
  }

  removeErrorById("no-game-selected-error-message"); // reset error state before opening modal so no past errors appear if modal is reopneed
  loadGameModal.showModal();
};

export const getAllSavedGameOptions = () => {
  return Array.from(
    document.getElementsByClassName("game-to-load-select-option")
  );
};

export const removeLoadGameOptions = () => {
  const allExistingGameLoadOptions = getAllSavedGameOptions();
  allExistingGameLoadOptions.forEach((gameLoadOption) => {
    gameLoadOption.remove();
  });
};

export const removeSingleLoadGameOption = (nameOfGame) => {
  const allExistingGameLoadOptions = getAllSavedGameOptions();
  allExistingGameLoadOptions.forEach((existingOption) => {
    if (existingOption.value === nameOfGame) {
      existingOption.remove();
    }
  });
};

export const closeLoadGameModal = () => {
  const loadGameModal = document.getElementById("load-game-modal");
  removeLoadGameOptions(); // so no options are ever appended more than once
  loadGameModal.close();
};

export const closeSaveGameModal = () => {
  const saveGameModal = document.getElementById("save-game-modal");
  removeLoadGameOptions(); // so no options are ever appended more than once
  saveGameModal.close();
};

export const grabSelectedOption = (selectElement) => {
  const indexOfSelectedOption = selectElement.selectedIndex;
  if (indexOfSelectedOption === 0) return;
  const selectedOption = selectElement[indexOfSelectedOption].value;
  return selectedOption;
};

export const saveCanvas = () => {
  const canvas = document.getElementById("canvas");
  const canvasURL = canvas.toDataURL("image/png");
  return canvasURL;
};

export const drawPreviousCanvas = (canvasURL) => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const image = document.createElement("img");
  image.width = NUM_COLS * GRID_SPACE;
  image.height = NUM_ROWS * GRID_SPACE;
  image.src = canvasURL;

  image.onload = drawSavedCanvas; // wait for the image to load before trying to draw it on the ctx
  function drawSavedCanvas() {
    ctx.drawImage(this, 0, 0); // "this" is the img on which drawSavedCanvas is called.
  }
};

export const closeConfirmationModal = () => {
  const confirmationModal = document.getElementById("confirmation-modal");
  // get all the id's of modalContent that is rendered on this shared confirmationModal across every page
  const keys = Object.keys(allModals.confirmationModalData);
  const allContainerIds = keys.map(
    (key) => allModals.confirmationModalData[key].containerId
  );
  allContainerIds.forEach((containerId) => {
    const modalContent = document.getElementById(containerId);
    // remove whatever modal content is currently displayed
    if (modalContent) {
      modalContent.remove();
    }
  });
  // close the modal
  confirmationModal.close();
};

export const displayScore = (scoreNum) => {
  let returnString = "";
  const scoreAsString = scoreNum.toString();
  if (scoreAsString.length <= 3) return scoreAsString;
  let counter = 0;
  for (let i = scoreAsString.length - 1; i >= 0; i--) {
    const currentChar = scoreAsString[i];
    if (counter > 0 && counter % 3 === 0) {
      returnString = `${currentChar},` + returnString;
    } else {
      returnString = currentChar + returnString;
    }
    counter++;
  }

  return returnString;
};

// * UI Form Data

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
          labelText: "A",
          input: {
            id: "music-theme-one",
            type: "radio",
            name: "gameMusicSelection",
            value: "theme-1",
          },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "B",
          input: {
            id: "music-theme-two",
            type: "radio",
            name: "gameMusicSelection",
            value: "theme-2",
          },
        },
        {
          containerClasses: ["radio-option"],
          labelText: "C",
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
      labelText: "Select a Saved Game",
      containerClasses: [],
      containerId: "saved-games-dropdown-container",
      labelClasses: [],
      inputClasses: [],
      input: {
        id: "load-game-select",
        name: "gameToLoad",
      },
    },
  ],
  deleteButtons: {
    containerClasses: [],
    buttonObjs: [
      {
        buttonText: "Delete Selected Game",
        type: "button",
        id: "delete-saved-game-button",
        classes: [],
      },
      {
        buttonText: "Delete All Saved Games",
        type: "button",
        id: "delete-all-saved-games-button",
        classes: [],
      },
    ],
  },
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
        maxLength: 18,
      },
    },
  ],
  submitButton: {
    id: "",
    classes: [],
    buttonText: "Save Game",
  },
};

// * Image Data

export const mainMenuImageData = {
  containerClasses: ["main-menu-image-container"],
  containerId: "main-menu-image-container",
  imageClasses: [],
  imageId: "main-menu-image",
  imageSrc: "/images/tetris.png",
  imageAltText: "Stock image of Tetris blocks",
};

// * High Scores Table Data

export const highScoresTableFields = ["No.", "Player", "Score"];
