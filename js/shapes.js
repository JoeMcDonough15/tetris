import { GRID_SPACE } from "./gridSpecs.js";
import Block from "./block.js";

// Colors
const GREEN = "rgb(0 255 0)";
const BLUE = "rgb(0 100 255)";
const RED = "rgb(255 0 0)";
const YELLOW = "rgb(255 255 0)";
const ORANGE = "rgb(255 127 0)";

class Shape {
  constructor(colorString, startingOffset) {
    this.numBlocks = 4;
    this.shapeColor = colorString;
    this.blocks = [];
    for (let i = 0; i < this.numBlocks; i++) {
      const newBlock = new Block(startingOffset, this.shapeColor);
      this.blocks.push(newBlock);
    }
    this.initialBlock = this.blocks[0];
  }

  clearShape = () => {
    this.blocks.forEach((block) => {
      block.resetLedges();
      block.clearBlock();
    });
  };
}

export class Line extends Shape {
  constructor() {
    super(GREEN, 40);
    this.shapeHeight = GRID_SPACE;
    this.shapeWidth = GRID_SPACE * this.numBlocks;
    this.rotation = "horizontal"; // horizontal or vertical
  }

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "horizontal") {
        // handle ledges
        block.isBottomLedge = true;
        if (index === 0) {
          block.isLeftLedge = true;
        }
        if (index === 3) {
          block.isRightLedge = true;
        }

        // handle coordinates
        block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE * index;
        block.yCoordinate = this.initialBlock.yCoordinate;
      } else if (this.rotation === "vertical") {
        // handle ledges
        if (index === 3) {
          block.isBottomLedge = true;
        }
        block.isLeftLedge = true;
        block.isRightLedge = true;

        // handle coordinates
        block.xCoordinate = this.initialBlock.xCoordinate;
        block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE * index;
      }

      block.drawBlock();
    });
  };

  rotate = () => {
    if (
      (this.rotation === "vertical" && this.initialBlock.xCoordinate > 520) ||
      (this.rotation === "horizontal" && this.initialBlock.yCoordinate >= 720)
    ) {
      return;
    }
    this.clearShape();
    this.rotation = this.rotation === "horizontal" ? "vertical" : "horizontal";
    if (this.rotation === "vertical") {
      this.shapeHeight = GRID_SPACE * this.numBlocks;
      this.shapeWidth = GRID_SPACE;
    } else {
      this.shapeHeight = GRID_SPACE;
      this.shapeWidth = GRID_SPACE * this.numBlocks;
    }
    this.drawShape();
  };
}

export class Square extends Shape {
  constructor() {
    super(BLUE, 20);
    this.shapeHeight = GRID_SPACE * (this.numBlocks / 2);
    this.shapeWidth = GRID_SPACE * (this.numBlocks / 2);
  }

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      // handle ledges for each block
      if (index > 1) {
        block.isBottomLedge = true;
      }
      if (index % 2 === 0) {
        block.isLeftLedge = true;
      } else {
        block.isRightLedge = true;
      }

      // handle coordinates for each block
      if (index === 1) {
        block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
        block.yCoordinate = this.initialBlock.yCoordinate;
      } else if (index === 2) {
        block.xCoordinate = this.initialBlock.xCoordinate;
        block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
      } else if (index === 3) {
        block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
        block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
      }
      block.drawBlock();
    });
  };

  rotate = () => {
    return;
  };
}

export class TShape extends Shape {
  constructor() {
    super(RED, 40);
    this.shapeHeight = GRID_SPACE * (this.numBlocks / 2);
    this.shapeWidth = GRID_SPACE * (this.numBlocks - 1);
    this.rotation = "up"; // up, right, down, left
  }

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "up") {
        // handle ledges
        if (index < 3) {
          block.isBottomLedge = true;
        }
        if (index === 0 || index === 3) {
          block.isLeftLedge = true;
        }
        if (index > 1) {
          block.isRightLedge = true;
        }

        // handle coordinates and bottom ledges
        if (index === 3) {
          // place the final block above the middle block
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate - GRID_SPACE;
        } else {
          // place blocks in a row and list these as the bottom ledge blocks
          block.xCoordinate =
            this.initialBlock.xCoordinate + GRID_SPACE * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
        }
      } else if (this.rotation === "right") {
        // handle ledges
        if (index > 1) {
          block.isBottomLedge = true;
        }
        if (index < 3) {
          block.isLeftLedge = true;
        }
        if (index !== 1) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // put the final block to the right of the middle block
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
        } else {
          // stack the blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + GRID_SPACE * index;
        }
      } else if (this.rotation === "left") {
        // handle ledges
        if (index > 1) {
          block.isBottomLedge = true;
        }
        if (index !== 1) {
          block.isLeftLedge = true;
        }
        if (index < 3) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // put this block to the left of the middle block
          block.xCoordinate = this.initialBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
        } else {
          // stack the blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + GRID_SPACE * index;
        }
      } else if (this.rotation === "down") {
        // handle ledges
        if (index !== 1) {
          block.isBottomLedge = true;
        }
        if (index === 0 || index === 3) {
          block.isLeftLedge = true;
        }
        if (index > 1) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // put this block below the middle block
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
        } else {
          // place blocks in a row
          block.xCoordinate =
            this.initialBlock.xCoordinate + GRID_SPACE * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
        }
      }
      block.drawBlock();
    });
  };

  rotate = () => {
    if (this.initialBlock.yCoordinate >= 740) {
      return;
    }
    if (this.rotation === "right" && this.initialBlock.xCoordinate >= 560) {
      this.rotation = "down";
    } else if (
      this.rotation === "left" &&
      this.initialBlock.xCoordinate >= 580
    ) {
      return;
    } else if (
      this.rotation === "left" &&
      this.initialBlock.xCoordinate >= 560
    ) {
      this.rotation = "up";
    } else if (
      this.rotation === "down" &&
      this.initialBlock.xCoordinate === 0
    ) {
      this.rotation = "left";
    }
    this.clearShape();
    if (this.rotation === "up") {
      this.rotation = "right";
      this.shapeHeight = GRID_SPACE * 3;
      this.shapeWidth = GRID_SPACE * 2;
    } else if (this.rotation === "right") {
      this.rotation = "down";
      this.shapeHeight = GRID_SPACE * 2;
      this.shapeWidth = GRID_SPACE * 3;
    } else if (this.rotation === "down") {
      this.rotation = "left";
      this.shapeHeight = GRID_SPACE * 3;
      this.shapeWidth = GRID_SPACE * 2;
    } else if (this.rotation === "left") {
      this.rotation = "up";
      this.shapeHeight = GRID_SPACE * 2;
      this.shapeWidth = GRID_SPACE * 3;
    }
    this.drawShape();
  };
}

export class LShape extends Shape {
  constructor() {
    super(YELLOW, 20);
    this.shapeHeight = GRID_SPACE * 3;
    this.shapeWidth = GRID_SPACE * 2;
    this.rotation = "down"; // down, up, left, right
  }

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "down") {
        // handle ledges
        if (index > 1) {
          block.isBottomLedge = true;
        }
        if (index < 3) {
          block.isLeftLedge = true;
        }
        if (index !== 2) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // place this block on the bottom right
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE * 2;
        } else {
          // stack blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + GRID_SPACE * index;
        }
      } else if (this.rotation === "right") {
        // handle ledges
        if (index < 3) {
          block.isBottomLedge = true;
        }
        if (index === 0 || index === 3) {
          block.isLeftLedge = true;
        }
        if (index > 1) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // put block on top right
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE * 2;
          block.yCoordinate = this.initialBlock.yCoordinate - GRID_SPACE;
        } else {
          // place blocks in a row
          block.xCoordinate =
            this.initialBlock.xCoordinate + GRID_SPACE * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
        }
      } else if (this.rotation === "left") {
        // handle ledges
        if (index > 0) {
          block.isBottomLedge = true;
        }
        if (index === 0 || index === 3) {
          block.isLeftLedge = true;
        }
        if (index > 1) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // put block on bottom left
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
        } else {
          // place blocks in a row
          block.xCoordinate =
            this.initialBlock.xCoordinate + GRID_SPACE * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
        }
      } else if (this.rotation === "up") {
        // handle ledges
        if (index > 1) {
          block.isBottomLedge = true;
        }
        if (index > 0) {
          block.isLeftLedge = true;
        }
        if (index < 3) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // put this block on the top left
          block.xCoordinate = this.initialBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate;
        } else {
          // stack blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + GRID_SPACE * index;
        }
      }
      block.drawBlock();
    });
  };

  rotate = () => {
    if (this.initialBlock.yCoordinate >= 740) {
      return;
    }
    if (this.rotation === "left" && this.initialBlock.xCoordinate === 0) {
      this.rotation = "up";
    } else if (
      this.rotation === "down" &&
      this.initialBlock.xCoordinate >= 560
    ) {
      this.rotation = "left";
    } else if (this.rotation === "up" && this.initialBlock.xCoordinate >= 580) {
      return;
    } else if (this.rotation === "up" && this.initialBlock.xCoordinate >= 560) {
      this.rotation = "right";
    }
    this.clearShape();
    if (this.rotation === "down") {
      this.rotation = "left";
      this.shapeHeight = GRID_SPACE * 2;
      this.shapeWidth = GRID_SPACE * 3;
    } else if (this.rotation === "left") {
      this.rotation = "up";
      this.shapeHeight = GRID_SPACE * 3;
      this.shapeWidth = GRID_SPACE * 2;
    } else if (this.rotation === "up") {
      this.rotation = "right";
      this.shapeHeight = GRID_SPACE * 2;
      this.shapeWidth = GRID_SPACE * 3;
    } else if (this.rotation === "right") {
      this.rotation = "down";
      this.shapeHeight = GRID_SPACE * 3;
      this.shapeWidth = GRID_SPACE * 2;
    }
    this.drawShape();
  };
}

export class JShape extends Shape {
  constructor() {
    super(ORANGE, 0);
    this.shapeHeight = GRID_SPACE * 4;
    this.shapeWidth = GRID_SPACE * 3;
    this.rotation = "down"; // down, up, left, right
  }

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "down") {
        // handle ledges
        if (index > 1) {
          block.isBottomLedge = true;
        }
        if (index !== 2) {
          block.isLeftLedge = true;
        }
        if (index < 3) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // put this block on the bottom left
          block.xCoordinate = this.initialBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE * 2;
        } else {
          // stack blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + GRID_SPACE * index;
        }
      } else if (this.rotation === "right") {
        // handle ledges
        if (index !== 2) {
          block.isBottomLedge = true;
        }
        if (index === 0 || index === 3) {
          block.isLeftLedge = true;
        }
        if (index > 1) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // put block on bottom right
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE * 2;
          block.yCoordinate = this.initialBlock.yCoordinate + GRID_SPACE;
        } else {
          // place blocks in a row
          block.xCoordinate =
            this.initialBlock.xCoordinate + GRID_SPACE * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
        }
      } else if (this.rotation === "left") {
        // handle ledges
        if (index < 3) {
          block.isBottomLedge = true;
        }
        if (index === 0 || index === 3) {
          block.isLeftLedge = true;
        }
        if (index > 1) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // put block on top left
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate = this.initialBlock.yCoordinate - GRID_SPACE;
        } else {
          // place blocks in a row
          block.xCoordinate =
            this.initialBlock.xCoordinate + GRID_SPACE * index;
          block.yCoordinate = this.initialBlock.yCoordinate;
        }
      } else if (this.rotation === "up") {
        // handle ledges
        if (index > 1) {
          block.isBottomLedge = true;
        }
        if (index < 3) {
          block.isLeftLedge = true;
        }
        if (index > 0) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 3) {
          // place this block on the top right
          block.xCoordinate = this.initialBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.initialBlock.yCoordinate;
        } else {
          // stack blocks vertically
          block.xCoordinate = this.initialBlock.xCoordinate;
          block.yCoordinate =
            this.initialBlock.yCoordinate + GRID_SPACE * index;
        }
      }
      block.drawBlock();
    });
  };

  rotate = () => {
    if (this.initialBlock.yCoordinate >= 740) {
      return;
    }
    if (this.rotation === "right" && this.initialBlock.xCoordinate === 0) {
      this.rotation = "left";
    } else if (
      this.rotation === "down" &&
      this.initialBlock.xCoordinate >= 580
    ) {
      return;
    } else if (
      this.rotation === "down" &&
      this.initialBlock.xCoordinate >= 560
    ) {
      this.rotation = "left";
    } else if (this.rotation === "up" && this.initialBlock.xCoordinate >= 560) {
      this.rotation = "right";
    }
    this.clearShape();
    if (this.rotation === "down") {
      this.rotation = "left";
      this.shapeHeight = GRID_SPACE * 2;
      this.shapeWidth = GRID_SPACE * 3;
    } else if (this.rotation === "left") {
      this.rotation = "up";
      this.shapeHeight = GRID_SPACE * 3;
      this.shapeWidth = GRID_SPACE * 2;
    } else if (this.rotation === "up") {
      this.rotation = "right";
      this.shapeHeight = GRID_SPACE * 2;
      this.shapeWidth = GRID_SPACE * 3;
    } else if (this.rotation === "right") {
      this.rotation = "down";
      this.shapeHeight = GRID_SPACE * 3;
      this.shapeWidth = GRID_SPACE * 2;
    }
    this.drawShape();
  };
}

export default Shape;
