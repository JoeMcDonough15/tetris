import {
  createControllerContainer,
  createControllerRow,
  createCustomHeading,
  createSectionContainer,
  createSettingsModal,
  createSubHeaders,
  createNavButtons,
  createPreviewImgContainer,
} from "../../components/index.js";
import HighScores from "../../high-scores/js/api/highScoresApi.js";
import Settings from "../../settings.js";
import Tetris from "./game/tetris.js";

// Build out the UI

const bodyArrayFromCollection = Array.from(
  document.getElementsByTagName("body")
);
const body = bodyArrayFromCollection[0];
body.prepend(createCustomHeading("h1", "Tetris", "main-heading"));

// target gameGridContainer to inject this UI after it
const gameGridContainer = document.getElementById("game-grid-container");

// Build out the gameDetailsContainer
const gameDetailsContainer = createSectionContainer("game-details-container");

const subHeaders = [
  { headerText: "Level: 0", id: "level-heading" },
  { headerText: "Score: 0", id: "total-score-heading" },
  { headerText: "Rows: 0", id: "rows-cleared-heading" },
];
const subHeadersContainer = createSubHeaders("h3", ...subHeaders);

const previewImgContainer = createPreviewImgContainer("preview-img-container");

const imageSrcPrefix = "/images/buttons/";
const imageSrcSuffix = ".png";
const controllerRowOneObjs = [
  {
    id: "btn-up",
    imageSrc: `${imageSrcPrefix}rotate${imageSrcSuffix}`,
    imageAltText: "button to rotate shape clockwise",
  },
];

const controllerRowTwoObjs = [
  {
    id: "btn-left",
    imageSrc: `${imageSrcPrefix}left-arrow${imageSrcSuffix}`,
    imageAltText: "a button to move the piece to the left",
  },
  {
    id: "btn-pause",
    imageSrc: `${imageSrcPrefix}pause-play${imageSrcSuffix}`,
    imageAltText: "a button to toggle the play/pause state",
  },
  {
    id: "btn-right",
    imageSrc: `${imageSrcPrefix}right-arrow${imageSrcSuffix}`,
    imageAltText: "a button to move the piece to the right",
  },
];

const controllerRowThreeObjs = [
  {
    id: "btn-down",
    imageSrc: `${imageSrcPrefix}down-arrow${imageSrcSuffix}`,
    imageAltText: "a button to soft drop the piece",
  },
];

const controllerContainer = createControllerContainer();

const controllerRowOne = createControllerRow(
  "controller-row-one",
  ...controllerRowOneObjs
);
const controllerRowTwo = createControllerRow(
  "controller-row-two",
  ...controllerRowTwoObjs
);
const controllerRowThree = createControllerRow(
  "controller-row-three",
  ...controllerRowThreeObjs
);

controllerContainer.append(
  controllerRowOne,
  controllerRowTwo,
  controllerRowThree
);

gameDetailsContainer.append(
  subHeadersContainer,
  previewImgContainer,
  controllerContainer
);

const settingsModal = createSettingsModal("Return to Game");

gameGridContainer.after(gameDetailsContainer, settingsModal);

// Instantiate the Settings object
const updateSettingsForm = document.getElementById("update-settings-form");
const savedSettings = JSON.parse(
  window.sessionStorage.getItem("savedSettings")
);

const settingsObj = new Settings(
  settingsModal,
  updateSettingsForm,
  savedSettings
);
settingsObj.listenForSettingsUpdates(); // adds event listener for form submission to update settings

// Instantiate a high scores object for use inside the Tetris game
const highScoresObj = new HighScores();

// Target DOM Elements for use in Tetris game
const playGameContainer = document.getElementById("play-game-container");
const mainHeading = document.getElementById("main-heading");
const previewImg = document.getElementById("preview-img");
const levelHeading = document.getElementById("level-heading");
const totalScoreHeading = document.getElementById("total-score-heading");
const rowsClearedHeading = document.getElementById("rows-cleared-heading");
const postGameNavButtons = createNavButtons(
  { navDestination: "/", buttonText: "Return to Main Menu" },
  { navDestination: "/high-scores", buttonText: "View High Scores" }
);

// Instantiate the Tetris game
const game = new Tetris(
  settingsObj,
  highScoresObj,
  settingsModal,
  playGameContainer,
  gameGridContainer,
  gameDetailsContainer,
  mainHeading,
  previewImg,
  levelHeading,
  totalScoreHeading,
  rowsClearedHeading,
  postGameNavButtons
);

// Target Elements for Event Listeners
const modalCloseButton = document.getElementById("close-modal-button");
const rotateButton = document.getElementById("btn-up");
const softDropButton = document.getElementById("btn-down");
const moveLeftButton = document.getElementById("btn-left");
const moveRightButton = document.getElementById("btn-right");
const pauseButton = document.getElementById("btn-pause");
const scoreHeading = document.getElementById("total-score-heading");
const updateSettingsSubmitButton = document.getElementById(
  "update-settings-submit-button"
);

scoreHeading.innerText = `Score: ${game.playerTotalScore}`;

// Mouse Events
updateSettingsSubmitButton.addEventListener("click", () => {
  game.togglePause();
});

modalCloseButton.addEventListener("click", () => {
  settingsModal.close();
  game.togglePause();
});

pauseButton.addEventListener("click", () => {
  game.togglePause();
});

rotateButton.addEventListener("click", () => {
  game.rotatePiece();
});

moveLeftButton.addEventListener("click", () => {
  game.moveShape("left");
});

moveRightButton.addEventListener("click", () => {
  game.moveShape("right");
});

softDropButton.addEventListener("click", () => {
  game.softDrop();
});

// Key Events
window.addEventListener("keyup", (e) => {
  if (e.key === "p") {
    game.togglePause();
  }
});

window.addEventListener("keydown", (e) => {
  const keyName = e.key;
  if (keyName === "ArrowRight") {
    game.moveShape("right");
  } else if (keyName === "ArrowLeft") {
    game.moveShape("left");
  } else if (keyName === "r" || keyName === "ArrowUp") {
    game.rotatePiece();
  } else if (keyName === "ArrowDown") {
    game.softDrop();
  } else if (keyName === "Escape" && game.gamePaused) {
    game.togglePause();
  }
});

game.startGame();
