import {
  determineRowAndColumn,
  GRID_SPACE,
  reachedBottomOfGrid,
  reachedLeftSideOfGrid,
  reachedRightSideOfGrid,
} from "./gridSpecs.js";
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

  rotate = (rotationNum) => {
    const rotationIndex = rotationNum % this.availableRotations.length;
    this.clearShape();
    this.rotation = this.availableRotations[rotationIndex];
    this.drawShape();
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

  checkForRotationConflict = (directionToRotate, gameGrid) => {
    const [anchorBlockRow, anchorBlockCol] = determineRowAndColumn(
      this.anchorBlock
    );
    if (directionToRotate === "horizontal") {
      const oneColLeft = anchorBlockCol - 1;
      const oneColRight = anchorBlockCol + 1;
      const twoColsRight = anchorBlockCol + 2;
      // make sure this rotation would not put us out of range on either the left or right side of the grid
      if (
        reachedLeftSideOfGrid(anchorBlockCol) ||
        reachedRightSideOfGrid(oneColRight)
      ) {
        return true;
      }

      // Next, check the necessary, adjacent spaces of the gameGrid to see if they are already occupied by another block
      if (
        gameGrid[anchorBlockRow][oneColLeft] ||
        gameGrid[anchorBlockRow][oneColRight] ||
        gameGrid[anchorBlockRow][twoColsRight]
      ) {
        return true;
      }
    } else if (directionToRotate === "vertical") {
      const oneRowAbove = anchorBlockRow - 1;
      const oneRowBelow = anchorBlockRow + 1;
      const twoRowsBelow = anchorBlockRow + 2;
      // make sure we would not go out of range
      if (reachedBottomOfGrid(oneRowBelow)) {
        return true;
      }
      // Next, check the necessary, adjacent spaces of the gameGrid to see if they are already occupied by another block
      if (
        gameGrid[oneRowAbove][anchorBlockCol] ||
        gameGrid[oneRowBelow][anchorBlockCol] ||
        gameGrid[twoRowsBelow][anchorBlockCol]
      ) {
        return true;
      }
    }
    return false;
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
          block.isBottomLedge = true;
        }
        if (index !== 2) {
          block.isLeftLedge = true;
        }
        if (index > 0) {
          block.isRightLedge = true;
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

  checkForRotationConflict = (directionToRotate, gameGrid) => {
    const [anchorBlockRow, anchorBlockCol] = determineRowAndColumn(
      this.anchorBlock
    );
    // Adjacent grid spaces
    const oneColLeft = anchorBlockCol - 1;
    const oneColRight = anchorBlockCol + 1;
    const oneRowDown = anchorBlockRow + 1;
    const oneRowUp = anchorBlockRow - 1;

    if (directionToRotate === "up") {
      // first make sure we would not go out of range on the right side only.
      // then check for conflicts with other blocks on the grid
      if (
        reachedRightSideOfGrid(anchorBlockCol) ||
        gameGrid[oneRowUp][anchorBlockCol] ||
        gameGrid[anchorBlockRow][oneColLeft] ||
        gameGrid[anchorBlockRow][oneColRight]
      ) {
        return true;
      }
    } else if (directionToRotate === "right") {
      // first make sure we would not go out of range on the bottom side only.
      // then check for conflicts with other blocks on the grid
      if (
        reachedBottomOfGrid(anchorBlockRow) ||
        gameGrid[oneRowUp][anchorBlockCol] ||
        gameGrid[oneRowDown][anchorBlockCol] ||
        gameGrid[anchorBlockRow][oneColRight]
      ) {
        return true;
      }
    } else if (directionToRotate === "down") {
      // first make sure we would not go out of range on the left side only.
      // then check for conflicts with other blocks on the grid
      if (
        reachedLeftSideOfGrid(anchorBlockCol) ||
        gameGrid[anchorBlockRow][oneColLeft] ||
        gameGrid[anchorBlockRow][oneColRight] ||
        gameGrid[oneRowDown][anchorBlockCol]
      ) {
        return true;
      }
    } else if (directionToRotate === "left") {
      // we can't be at the left edge, the right edge, or the bottom edge in this case
      // because we are coming from the down position and there are blocks to the left, right, and below this.anchorBlock
      // so we just need to check the adjacent grid spaces
      if (
        gameGrid[oneRowUp][anchorBlockCol] ||
        gameGrid[anchorBlockRow][oneColLeft] ||
        gameGrid[oneRowDown][anchorBlockCol]
      ) {
        return true;
      }
    }

    return false;
  };
}

export class LShape extends Shape {
  constructor() {
    super(ORANGE, 20);
    this.shapeName = "lShape";
    this.shapeHeight = GRID_SPACE * 3;
    this.shapeWidth = GRID_SPACE * 2;
    this.availableRotations = ["left", "up", "right", "down"];
    this.rotation = this.availableRotations[0];
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

  checkForRotationConflict = (directionToRotate, gameGrid) => {
    const [anchorBlockRow, anchorBlockCol] = determineRowAndColumn(
      this.anchorBlock
    );
    const oneRowUp = anchorBlockRow - 1;
    const oneRowDown = anchorBlockRow + 1;
    const oneColLeft = anchorBlockCol - 1;
    const oneColRight = anchorBlockCol + 1;

    if (directionToRotate === "left") {
      // make sure we would not go out of range on the left side only.
      // Then, check to see if the adjacent spaces are occupied
      if (
        reachedLeftSideOfGrid(anchorBlockCol) ||
        gameGrid[anchorBlockRow][oneColLeft] ||
        gameGrid[anchorBlockRow][oneColRight] ||
        gameGrid[oneRowDown][oneColLeft]
      ) {
        return true;
      }
    } else if (directionToRotate === "up") {
      // since we are coming from left, we can't go out of range because we already have 2 blocks to the left, one to the right, and one below this.anchorBlock
      // so we just need to check the adjacent blocks for existing blocks in the grid
      if (
        gameGrid[oneRowUp][anchorBlockCol] ||
        gameGrid[oneRowDown][anchorBlockCol] ||
        gameGrid[oneRowUp][oneColLeft]
      )
        return true;
    } else if (directionToRotate === "right") {
      // we only need to check that we are not at the right ledge to stay in range
      // then the adjacent grid spaces for existing blocks
      if (
        reachedRightSideOfGrid(anchorBlockCol) ||
        gameGrid[anchorBlockRow][oneColLeft] ||
        gameGrid[anchorBlockRow][oneColRight] ||
        gameGrid[oneRowUp][oneColRight]
      ) {
        return true;
      }
    } else if (directionToRotate === "down") {
      // check that we haven't reached the bottom of the grid to stay in range and then the adjacent spaces for
      // occupying blocks
      if (
        reachedBottomOfGrid(anchorBlockRow) ||
        gameGrid[oneRowUp][anchorBlockCol] ||
        gameGrid[oneRowDown][anchorBlockCol] ||
        gameGrid[oneRowDown][oneColRight]
      ) {
        return true;
      }
    }
  };
}

export class JShape extends Shape {
  constructor() {
    super(YELLOW, 0);
    this.shapeName = "jShape";
    this.shapeHeight = GRID_SPACE * 4;
    this.shapeWidth = GRID_SPACE * 3;
    this.availableRotations = ["right", "down", "left", "up"];
    this.rotation = this.availableRotations[0];
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

  // rotate = (rotationNum) => {
  //   const rotationIndex = rotationNum % this.availableRotations.length;

  //   // if (this.anchorBlock.yCoordinate >= 740) {
  //   //   return;
  //   // }
  //   // if (this.rotation === "right" && this.anchorBlock.xCoordinate === 0) {
  //   //   this.rotation = "left";
  //   // } else if (
  //   //   this.rotation === "down" &&
  //   //   this.anchorBlock.xCoordinate >= 580
  //   // ) {
  //   //   return;
  //   // } else if (
  //   //   this.rotation === "down" &&
  //   //   this.anchorBlock.xCoordinate >= 560
  //   // ) {
  //   //   this.rotation = "left";
  //   // } else if (this.rotation === "up" && this.anchorBlock.xCoordinate >= 560) {
  //   //   this.rotation = "right";
  //   // }
  //   this.clearShape();
  //   this.rotation = this.availableRotations[rotationIndex];
  //   // if (this.rotation === "down") {
  //   //   this.rotation = "left";
  //   //   this.shapeHeight = GRID_SPACE * 2;
  //   //   this.shapeWidth = GRID_SPACE * 3;
  //   // } else if (this.rotation === "left") {
  //   //   this.rotation = "up";
  //   //   this.shapeHeight = GRID_SPACE * 3;
  //   //   this.shapeWidth = GRID_SPACE * 2;
  //   // } else if (this.rotation === "up") {
  //   //   this.rotation = "right";
  //   //   this.shapeHeight = GRID_SPACE * 2;
  //   //   this.shapeWidth = GRID_SPACE * 3;
  //   // } else if (this.rotation === "right") {
  //   //   this.rotation = "down";
  //   //   this.shapeHeight = GRID_SPACE * 3;
  //   //   this.shapeWidth = GRID_SPACE * 2;
  //   // }
  //   this.drawShape();
  // };
}

export default Shape;
