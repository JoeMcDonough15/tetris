import { GRID_SPACE } from "../../../utils/index.js";
import { canvas, ctx } from "./canvas.js";

class Block {
  constructor(color, xCoordinate, yCoordinate) {
    this.borderColor = "rgb(0 0 0)";
    this.fillColor = color;
    this.xCoordinate = xCoordinate
      ? xCoordinate
      : Math.floor(canvas.width / 2 - GRID_SPACE); // default x-coord is center of the canvas
    this.yCoordinate = yCoordinate ? yCoordinate : 0; // default y-coord is top of the canvas
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
