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
    this.anchorBlock = this.blocks[0];
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
    this.shapeName = "line";
    this.shapeHeight = GRID_SPACE;
    this.shapeWidth = GRID_SPACE * this.numBlocks;
    // this.rotation = "horizontal"; // horizontal or vertical
    this.availableRotations = ["horizontal", "vertical"];
    this.rotation = this.availableRotations[0];
  }

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "horizontal") {
        // handle ledges
        block.isBottomLedge = true;
        if (index === 1) {
          block.isLeftLedge = true;
        }
        if (index === 3) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 1) {
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
        } else if (index === 2) {
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
        } else if (index === 3) {
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE * 2;
        }
        block.yCoordinate = this.anchorBlock.yCoordinate;
      } else if (this.rotation === "vertical") {
        // handle ledges
        if (index === 3) {
          block.isBottomLedge = true;
        }
        block.isLeftLedge = true;
        block.isRightLedge = true;

        // handle coordinates
        block.xCoordinate = this.anchorBlock.xCoordinate;
        if (index === 1) {
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        } else if (index === 2) {
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        } else if (index === 3) {
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE * 2;
        }
      }

      block.drawBlock();
    });
  };

  rotate = () => {
    if (
      (this.rotation === "vertical" && this.anchorBlock.xCoordinate > 520) ||
      (this.rotation === "horizontal" && this.anchorBlock.yCoordinate >= 720)
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
    this.shapeName = "square";
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
        block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
        block.yCoordinate = this.anchorBlock.yCoordinate;
      } else if (index === 2) {
        block.xCoordinate = this.anchorBlock.xCoordinate;
        block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
      } else if (index === 3) {
        block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
        block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
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
    this.shapeName = "tShape";
    this.shapeHeight = GRID_SPACE * (this.numBlocks / 2);
    this.shapeWidth = GRID_SPACE * (this.numBlocks - 1);
    this.availableRotations = ["down", "left", "up", "right"];
    this.rotation = this.availableRotations[0];
  }

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "down") {
        // handle ledges
        if (index > 0) {
          block.isBottomLedge = true;
        }
        if (index === 1 || index === 2) {
          block.isLeftLedge = true;
        }
        if (index > 1) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 1) {
          // place it directly to the left of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 2) {
          // place it directly underneath the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        } else if (index === 3) {
          // place it directly to the right of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        }
      } else if (this.rotation === "left") {
        // handle ledges
        if (index > 1) {
          block.isBottomLedge = true;
        }
        if (index !== 0) {
          block.isLeftLedge = true;
        }
        if (index !== 2) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 1) {
          // place it directly above the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        } else if (index === 2) {
          // place it directly to the left of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 3) {
          // place it directly below the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        }
      } else if (this.rotation === "up") {
        // handle ledges
        if (index !== 2) {
          block.isBottomLedge = true;
        }
        if (index > 1) {
          block.isLeftLedge = true;
        }
        if (index === 1 || index === 2) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 1) {
          // place it directly to the right of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 2) {
          // place it directly above the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        } else if (index === 3) {
          // place it directly to the left of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        }
      } else if (this.rotation === "right") {
        // handle ledges
        if (index === 1 || index === 2) {
          block.isBottomLedge;
        }
        if (index !== 2) {
          block.isLeftLedge;
        }
        if (index > 0) {
          block.isRightLedge;
        }

        // handle coordinates
        if (index === 1) {
          // place it directly below the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        } else if (index === 2) {
          // place it directly to the right of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 3) {
          // place it directly above the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        }
      }
      block.drawBlock();
    });
  };

  rotate = () => {
    if (this.anchorBlock.yCoordinate >= 740) {
      return;
    }
    if (this.rotation === "right" && this.anchorBlock.xCoordinate >= 560) {
      this.rotation = "down";
    } else if (
      this.rotation === "left" &&
      this.anchorBlock.xCoordinate >= 580
    ) {
      return;
    } else if (
      this.rotation === "left" &&
      this.anchorBlock.xCoordinate >= 560
    ) {
      this.rotation = "up";
    } else if (this.rotation === "down" && this.anchorBlock.xCoordinate === 0) {
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
    super(ORANGE, 20);
    this.shapeName = "lShape";
    this.shapeHeight = GRID_SPACE * 3;
    this.shapeWidth = GRID_SPACE * 2;
    this.availableRotations = ["left", "up", "right", "down"];
    this.rotation = availableRotations[0];
  }

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "left") {
        // handle ledges
        if (index !== 2) {
          block.isBottomLedge = true;
        }
        if (index > 1) {
          block.isLeftLedge = true;
        }
        if (index === 1 || index === 3) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 1) {
          // place it directly to the right of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 2) {
          // place it directly to the left of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 3) {
          // place it to the bottom left of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        }
      } else if (this.rotation === "up") {
        // handle ledges
        if (index === 1 || index === 3) {
          block.isBottomLedge = true;
        }
        if (index !== 2) {
          block.isLeftLedge = true;
        }
        if (index < 3) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 1) {
          // place it directly below the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        } else if (index === 2) {
          // place it directly above the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        } else if (index === 3) {
          // place it to the top left of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        }
      } else if (this.rotation === "right") {
        // handle ledges
        if (index < 3) {
          block.isBottomLedge = true;
        }
        if (index === 1 || index === 3) {
          block.isLeftLedge = true;
        }
        if (index > 1) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 1) {
          // place it directly to the left of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 2) {
          // place it directly to the right of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 3) {
          // place it to the top right of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        }
      } else if (this.rotation === "down") {
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
        if (index === 1) {
          // place this block directly above the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        } else if (index === 2) {
          // place this block directly below the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        } else if (index === 3) {
          // place it to the bottom right of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        }
      }
      block.drawBlock();
    });
  };

  rotate = () => {
    if (this.anchorBlock.yCoordinate >= 740) {
      return;
    }
    if (this.rotation === "left" && this.anchorBlock.xCoordinate === 0) {
      this.rotation = "up";
    } else if (
      this.rotation === "down" &&
      this.anchorBlock.xCoordinate >= 560
    ) {
      this.rotation = "left";
    } else if (this.rotation === "up" && this.anchorBlock.xCoordinate >= 580) {
      return;
    } else if (this.rotation === "up" && this.anchorBlock.xCoordinate >= 560) {
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
    super(YELLOW, 0);
    this.shapeName = "jShape";
    this.shapeHeight = GRID_SPACE * 4;
    this.shapeWidth = GRID_SPACE * 3;
    this.availableRotations = ["right", "down", "left", "up"];
    this.rotation = availableRotations[0];
    this.rotation = "right";
  }

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "right") {
        // handle ledges
        if (index !== 2) {
          block.isBottomLedge = true;
        }
        if (index === 1 || index === 3) {
          block.isLeftLedge = true;
        }
        if (index > 1) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 1) {
          // place it directly to the left of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 2) {
          // place it directly to the right of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 3) {
          // place it to the bottom right of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        }
      } else if (this.rotation === "down") {
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
        if (index === 1) {
          // place it directly above the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        } else if (index === 2) {
          // place it directly below the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        } else if (index === 3) {
          // place it to the bottom left of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        }
      } else if (this.rotation === "left") {
        // handle ledges
        if (index < 3) {
          block.isBottomLedge = true;
        }
        if (index > 1) {
          block.isLeftLedge = true;
        }
        if (index === 1 || index === 3) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 1) {
          // place it directly to the right of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 2) {
          // place it directly to the left of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 3) {
          // place it to the top left of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        }
      } else if (this.rotation === "up") {
        // handle ledges
        if (index === 1 || index === 3) {
          block.isBottomLedge = true;
        }
        if (index < 3) {
          block.isLeftLedge = true;
        }
        if (index !== 2) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 1) {
          // place it directly below the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        } else if (index === 2) {
          // place it directly above the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        } else if (index === 3) {
          // place it to the top right of the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        }
      }
      block.drawBlock();
    });
  };

  rotate = () => {
    if (this.anchorBlock.yCoordinate >= 740) {
      return;
    }
    if (this.rotation === "right" && this.anchorBlock.xCoordinate === 0) {
      this.rotation = "left";
    } else if (
      this.rotation === "down" &&
      this.anchorBlock.xCoordinate >= 580
    ) {
      return;
    } else if (
      this.rotation === "down" &&
      this.anchorBlock.xCoordinate >= 560
    ) {
      this.rotation = "left";
    } else if (this.rotation === "up" && this.anchorBlock.xCoordinate >= 560) {
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
