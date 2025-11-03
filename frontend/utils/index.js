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

export const generateSoundPath = (soundEffect) => {
  return `${gameSoundsPathObj.prefix}${soundEffect}${gameSoundsPathObj.suffix}`;
};

// Menu Buttons
export const menuButtonsContainerObj = {
  elementName: "div",
  classes: ["menu-buttons"],
};

export const mainMenuButtonObjs = [
  { buttonText: "Start Game", navLink: "/play-game" },
  {
    buttonText: "View High Scores",
    navLink: "/high-scores",
  },
  {
    buttonText: "Settings",
    id: "open-modal-button",
  },
];

export const highScoresMenuButtonObjs = [
  { navLink: "/play-game", buttonText: "New Game" },
  { navLink: "/", buttonText: "Main Menu" },
];

export const postGameMenuButtonObjs = [
  { navLink: "/", buttonText: "Return to Main Menu" },
  { navLink: "/high-scores", buttonText: "View High Scores" },
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
  const allIds = Object.values(settingsInputIds);
  allIds.forEach((arrayOfIds) => {
    arrayOfIds.forEach((id) => {
      const currentInput = document.getElementById(id);
      const nameOfCurrentInput = currentInput.name;
      if (currentInput.type === "radio") {
        const currentSetting = settingsObj[nameOfCurrentInput];
        if (currentSetting === currentInput.value) {
          currentInput.checked = true;
        }
      } else {
        const currentSetting = settingsObj.keyControls[nameOfCurrentInput];
        currentInput.value = currentSetting;
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
