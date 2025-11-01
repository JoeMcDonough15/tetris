import {
  createCanvas,
  createMainContainer,
  createSectionContainer,
} from "../../../components/index.js";
import { NUM_ROWS, NUM_COLS, GRID_SPACE } from "./constants.js";

const bodyArrayFromCollection = Array.from(
  document.getElementsByTagName("body")
);
const body = bodyArrayFromCollection[0];

const mainContainer = createMainContainer("play-game-container");
const gameGridContainer = createSectionContainer("game-grid-container");

export const canvas = createCanvas("canvas");
canvas.width = NUM_COLS * GRID_SPACE;
canvas.height = NUM_ROWS * GRID_SPACE;
export const ctx = canvas.getContext("2d");

gameGridContainer.appendChild(canvas);
mainContainer.appendChild(gameGridContainer);
body.prepend(mainContainer);
