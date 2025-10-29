import { GRID_SPACE } from "./constants.js";
import { canvas, ctx } from "./canvas.js";

class Block {
  constructor(color) {
    this.borderColor = "rgb(0 0 0)";
    this.fillColor = color;
    this.xCoordinate = Math.floor(canvas.width / 2 - GRID_SPACE); // center of the canvas
    this.yCoordinate = 0; // top of the canvas
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
