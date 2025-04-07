import { NUM_ROWS, NUM_COLS, GRID_SPACE } from "./constants.js";

// Canvas
export const canvas = document.getElementById("canvas");
canvas.width = NUM_COLS * GRID_SPACE;
canvas.height = NUM_ROWS * GRID_SPACE;
export const ctx = canvas.getContext("2d");
