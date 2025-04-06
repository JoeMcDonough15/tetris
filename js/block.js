import { NUM_ROWS, NUM_COLS, GRID_SPACE } from "./constants.js";

// Canvas
const canvas = document.getElementById("canvas");
canvas.width = NUM_COLS * GRID_SPACE;
canvas.height = NUM_ROWS * GRID_SPACE;
const ctx = canvas.getContext("2d");

class Block {
  constructor(color) {
    this.borderColor = "rgb(0 0 0)";
    this.fillColor = color;
    this.xCoordinate = Math.floor(canvas.width / 2 - GRID_SPACE);
    this.yCoordinate = -20;
    this.isBottomLedge = false;
    this.isLeftLedge = false;
    this.isRightLedge = false;
  }

  clearBlock = () => {
    ctx.clearRect(this.xCoordinate, this.yCoordinate, GRID_SPACE, GRID_SPACE);
  };

  resetLedges = () => {
    this.isBottomLedge = false;
    this.isLeftLedge = false;
    this.isRightLedge = false;
  };

  drawBlock = () => {
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.borderColor;
    ctx.fillRect(this.xCoordinate, this.yCoordinate, GRID_SPACE, GRID_SPACE);
    ctx.strokeRect(this.xCoordinate, this.yCoordinate, GRID_SPACE, GRID_SPACE);
  };

  moveBlockDownOneRow = () => {
    this.clearBlock();
    this.yCoordinate += GRID_SPACE;
    this.drawBlock();
  };
}

export default Block;
