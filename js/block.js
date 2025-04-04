import { NUM_ROWS, NUM_COLS, GRID_SPACE } from "./gridSpecs.js";

// Canvas
const canvas = document.getElementById("canvas");
canvas.width = NUM_COLS * GRID_SPACE; // 600
canvas.height = NUM_ROWS * GRID_SPACE; // 800
const ctx = canvas.getContext("2d");

class Block {
  constructor(offSet, color) {
    this.borderColor = "rgb(0 0 0)";
    this.fillColor = color;
    this.xCoordinate = Math.floor(canvas.width / 2 - offSet);
    this.yCoordinate = 0;
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
