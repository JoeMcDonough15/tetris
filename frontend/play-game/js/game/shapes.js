import { generatePreviewImgPath, shapeColors } from "../../../utils/index.js";
import Block from "./block.js";
import { GRID_SPACE } from "../../../utils/index.js";

class Shape {
  constructor(colorString, xCoordinate, yCoordinate) {
    this.numBlocks = 4;
    this.shapeColor = colorString;
    this.blocks = [];
    for (let i = 0; i < this.numBlocks; i++) {
      const newBlock = new Block(this.shapeColor, xCoordinate, yCoordinate);
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

  determineRotationIndex = (rotationName) => {
    if (!this.availableRotations) return;
    return this.availableRotations.findIndex(
      (rotation) => rotation === rotationName
    );
  };
}

export class Line extends Shape {
  constructor(optionalXCoordinate, optionalYCoordinate, optionalRotationName) {
    super(shapeColors.green, optionalXCoordinate, optionalYCoordinate);
    this.shapeName = "line";
    this.availableRotations = ["horizontal", "vertical"];
    this.rotationIndex = optionalRotationName
      ? this.determineRotationIndex(optionalRotationName)
      : 0;
    this.rotation = this.availableRotations[this.rotationIndex];
    this.preview = generatePreviewImgPath(this.shapeName);
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

  checkForRotationConflict = (directionToRotate, game) => {
    const [anchorBlockRow, anchorBlockCol] = game.determineRowAndColumn(
      this.anchorBlock
    );
    if (game.reachedTopOfGrid(anchorBlockRow)) return true;
    const oneRowUp = anchorBlockRow - 1;
    const oneRowDown = anchorBlockRow + 1;
    const twoRowsDown = anchorBlockRow + 2;
    const oneColLeft = anchorBlockCol - 1;
    const oneColRight = anchorBlockCol + 1;
    const twoColsRight = anchorBlockCol + 2;
    if (directionToRotate === "horizontal") {
      // make sure this rotation would not put us out of range on either the left or right side of the grid.
      // Next, check the necessary, adjacent spaces of the game.grid to see if they are already occupied by another block
      if (
        game.reachedLeftSideOfGrid(anchorBlockCol) ||
        game.reachedRightSideOfGrid(oneColRight) ||
        game.grid[anchorBlockRow][oneColLeft] ||
        game.grid[anchorBlockRow][oneColRight] ||
        game.grid[anchorBlockRow][twoColsRight]
      ) {
        return true;
      }
    } else if (directionToRotate === "vertical") {
      // make sure we would not go out of range.
      // Next, check the necessary, adjacent spaces of the game.grid to see if they are already occupied by another block
      if (
        game.reachedBottomOfGrid(oneRowDown) ||
        game.grid[oneRowUp][anchorBlockCol] ||
        game.grid[oneRowDown][anchorBlockCol] ||
        game.grid[twoRowsDown][anchorBlockCol]
      ) {
        return true;
      }
    }
    return false;
  };
}

export class Square extends Shape {
  constructor(optionalXCoordinate, optionalYCoordinate) {
    super(shapeColors.blue, optionalXCoordinate, optionalYCoordinate);
    this.shapeName = "square";
    this.preview = generatePreviewImgPath(this.shapeName);
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
  constructor(optionalXCoordinate, optionalYCoordinate, optionalRotationName) {
    super(shapeColors.red, optionalXCoordinate, optionalYCoordinate);
    this.shapeName = "tShape";
    this.availableRotations = ["down", "left", "up", "right"];
    this.rotationIndex = optionalRotationName
      ? this.determineRotationIndex(optionalRotationName)
      : 0;
    this.rotation = this.availableRotations[this.rotationIndex];
    this.preview = generatePreviewImgPath(this.shapeName);
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

  checkForRotationConflict = (directionToRotate, game) => {
    const [anchorBlockRow, anchorBlockCol] = game.determineRowAndColumn(
      this.anchorBlock
    );
    if (game.reachedTopOfGrid(anchorBlockRow)) return true;
    // Adjacent grid spaces
    const oneColLeft = anchorBlockCol - 1;
    const oneColRight = anchorBlockCol + 1;
    const oneRowDown = anchorBlockRow + 1;
    const oneRowUp = anchorBlockRow - 1;

    if (directionToRotate === "up") {
      // first make sure we would not go out of range on the right side only.
      // then check for conflicts with other blocks on the grid
      if (
        game.reachedRightSideOfGrid(anchorBlockCol) ||
        game.grid[oneRowUp][anchorBlockCol] ||
        game.grid[anchorBlockRow][oneColLeft] ||
        game.grid[anchorBlockRow][oneColRight]
      ) {
        return true;
      }
    } else if (directionToRotate === "right") {
      // first make sure we would not go out of range on the bottom side only.
      // then check for conflicts with other blocks on the grid
      if (
        game.reachedBottomOfGrid(anchorBlockRow) ||
        game.grid[oneRowUp][anchorBlockCol] ||
        game.grid[oneRowDown][anchorBlockCol] ||
        game.grid[anchorBlockRow][oneColRight]
      ) {
        return true;
      }
    } else if (directionToRotate === "down") {
      // first make sure we would not go out of range on the left side only.
      // then check for conflicts with other blocks on the grid
      if (
        game.reachedLeftSideOfGrid(anchorBlockCol) ||
        game.grid[anchorBlockRow][oneColLeft] ||
        game.grid[anchorBlockRow][oneColRight] ||
        game.grid[oneRowDown][anchorBlockCol]
      ) {
        return true;
      }
    } else if (directionToRotate === "left") {
      // we can't be at the left edge, the right edge, or the bottom edge in this case
      // because we are coming from the down position and there are blocks to the left, right, and below this.anchorBlock
      // so we just need to check the adjacent grid spaces
      if (
        game.grid[oneRowUp][anchorBlockCol] ||
        game.grid[anchorBlockRow][oneColLeft] ||
        game.grid[oneRowDown][anchorBlockCol]
      ) {
        return true;
      }
    }

    return false;
  };
}

export class LShape extends Shape {
  constructor(optionalXCoordinate, optionalYCoordinate, optionalRotationName) {
    super(shapeColors.orange, optionalXCoordinate, optionalYCoordinate);
    this.shapeName = "lShape";
    this.availableRotations = ["left", "up", "right", "down"];
    this.rotationIndex = optionalRotationName
      ? this.determineRotationIndex(optionalRotationName)
      : 0;
    this.rotation = this.availableRotations[this.rotationIndex];
    this.preview = generatePreviewImgPath(this.shapeName);
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

        // handle coordinates other than the anchor block, which was reassigned already in game.moveShape(direction)
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

  checkForRotationConflict = (directionToRotate, game) => {
    const [anchorBlockRow, anchorBlockCol] = game.determineRowAndColumn(
      this.anchorBlock
    );
    if (game.reachedTopOfGrid(anchorBlockRow)) return true;

    const oneRowUp = anchorBlockRow - 1;
    const oneRowDown = anchorBlockRow + 1;
    const oneColLeft = anchorBlockCol - 1;
    const oneColRight = anchorBlockCol + 1;

    if (directionToRotate === "left") {
      // make sure we would not go out of range on the left side only.
      // Then, check to see if the adjacent spaces are occupied
      if (
        game.reachedLeftSideOfGrid(anchorBlockCol) ||
        game.grid[anchorBlockRow][oneColLeft] ||
        game.grid[anchorBlockRow][oneColRight] ||
        game.grid[oneRowDown][oneColLeft]
      ) {
        return true;
      }
    } else if (directionToRotate === "up") {
      // since we are coming from left, we can't go out of range because we already have 2 blocks to the left, one to the right, and one below this.anchorBlock
      // so we just need to check the adjacent blocks for existing blocks in the grid
      if (
        game.grid[oneRowUp][anchorBlockCol] ||
        game.grid[oneRowDown][anchorBlockCol] ||
        game.grid[oneRowUp][oneColLeft]
      )
        return true;
    } else if (directionToRotate === "right") {
      // we only need to check that we are not at the right ledge to stay in range
      // then the adjacent grid spaces for existing blocks
      if (
        game.reachedRightSideOfGrid(anchorBlockCol) ||
        game.grid[anchorBlockRow][oneColLeft] ||
        game.grid[anchorBlockRow][oneColRight] ||
        game.grid[oneRowUp][oneColRight]
      ) {
        return true;
      }
    } else if (directionToRotate === "down") {
      // check that we haven't reached the bottom of the grid to stay in range and then the adjacent spaces for
      // occupying blocks
      if (
        game.reachedBottomOfGrid(anchorBlockRow) ||
        game.grid[oneRowUp][anchorBlockCol] ||
        game.grid[oneRowDown][anchorBlockCol] ||
        game.grid[oneRowDown][oneColRight]
      ) {
        return true;
      }
    }
  };
}

export class JShape extends Shape {
  constructor(optionalXCoordinate, optionalYCoordinate, optionalRotationName) {
    super(shapeColors.yellow, optionalXCoordinate, optionalYCoordinate);
    this.shapeName = "jShape";
    this.availableRotations = ["right", "down", "left", "up"];
    this.rotationIndex = optionalRotationName
      ? this.determineRotationIndex(optionalRotationName)
      : 0;
    this.rotation = this.availableRotations[this.rotationIndex];
    this.preview = generatePreviewImgPath(this.shapeName);
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

  checkForRotationConflict = (directionToRotate, game) => {
    const [anchorBlockRow, anchorBlockCol] = game.determineRowAndColumn(
      this.anchorBlock
    );
    if (game.reachedTopOfGrid(anchorBlockRow)) return true;
    const oneRowUp = anchorBlockRow - 1;
    const oneRowDown = anchorBlockRow + 1;
    const oneColLeft = anchorBlockCol - 1;
    const oneColRight = anchorBlockCol + 1;

    if (directionToRotate === "right") {
      // that means we're coming from up
      // we only need to check the left side
      // then we can check the adjacent spaces for existing blocks
      if (
        game.reachedLeftSideOfGrid(anchorBlockCol) ||
        game.grid[anchorBlockRow][oneColLeft] ||
        game.grid[anchorBlockRow][oneColRight] ||
        game.grid[oneRowDown][oneColRight]
      ) {
        return true;
      }
    } else if (directionToRotate === "down") {
      // that means we're coming from right
      // that means we can't go out of range because the anchorBlock already has a block to its left, right, and below it
      // so just check the necessary adjacencies for existing blocks
      if (
        game.grid[oneRowUp][anchorBlockCol] ||
        game.grid[oneRowDown][anchorBlockCol] ||
        game.grid[oneRowDown][oneColLeft]
      ) {
        return true;
      }
    } else if (directionToRotate === "left") {
      // that means we're coming from down, so we just need to check the right side to make sure
      // we're in range.  Then we can check the adjacencies for existing blocks.
      if (
        game.reachedRightSideOfGrid(anchorBlockCol) ||
        game.grid[anchorBlockRow][oneColRight] ||
        game.grid[anchorBlockRow][oneColLeft] ||
        game.grid[oneRowUp][oneColLeft]
      ) {
        return true;
      }
    } else if (directionToRotate === "up") {
      // that means we're coming from left, so we need to make sure we're not on the bottom row to be in range
      if (
        game.reachedBottomOfGrid(anchorBlockRow) ||
        game.grid[oneRowDown][anchorBlockCol] ||
        game.grid[oneRowUp][anchorBlockCol] ||
        game.grid[oneRowUp][oneColRight]
      ) {
        return true;
      }
    }
  };
}

export class SShape extends Shape {
  constructor(optionalXCoordinate, optionalYCoordinate, optionalRotationName) {
    super(shapeColors.pink, optionalXCoordinate, optionalYCoordinate);
    this.shapeName = "sShape";
    this.availableRotations = ["horizontal", "vertical"];
    this.rotationIndex = optionalRotationName
      ? this.determineRotationIndex(optionalRotationName)
      : 0;
    this.rotation = this.availableRotations[this.rotationIndex];
    this.preview = generatePreviewImgPath(this.shapeName);
  }

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "horizontal") {
        // handle ledges
        if (index > 0) {
          block.isBottomLedge = true;
        }
        if (index === 0 || index === 3) {
          block.isLeftLedge = true;
        }
        if (index === 1 || index === 2) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 1) {
          // place directly to the right of anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 2) {
          // place directly beneath anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        } else if (index === 3) {
          // place to the bottom left of anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        }
      } else if (this.rotation === "vertical") {
        // handle ledges
        if (index === 0 || index === 3) {
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
          // place directly above the anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        } else if (index === 2) {
          // place directly to the right of anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 3) {
          // place to the bottom right of anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        }
      }
      block.drawBlock();
    });
  };

  checkForRotationConflict = (directionToRotate, game) => {
    const [anchorBlockRow, anchorBlockCol] = game.determineRowAndColumn(
      this.anchorBlock
    );
    if (game.reachedTopOfGrid(anchorBlockRow)) return true;
    const oneRowUp = anchorBlockRow - 1;
    const oneRowDown = anchorBlockRow + 1;
    const oneColLeft = anchorBlockCol - 1;
    if (directionToRotate === "horizontal") {
      if (
        game.reachedLeftSideOfGrid(anchorBlockCol) ||
        game.grid[oneRowDown][anchorBlockCol] ||
        game.grid[oneRowDown][oneColLeft]
      ) {
        return true;
      }
    } else if (directionToRotate === "vertical") {
      // we can't go out of range because we already have blocks to the right, left, and below anchor
      if (
        game.grid[oneRowUp][anchorBlockCol] ||
        game.grid[oneRowDown][oneColLeft]
      ) {
        return true;
      }
    }
  };
}

export class ZShape extends Shape {
  constructor(optionalXCoordinate, optionalYCoordinate, optionalRotationName) {
    super(shapeColors.purple, optionalXCoordinate, optionalYCoordinate);
    this.shapeName = "zShape";
    this.availableRotations = ["horizontal", "vertical"];
    this.rotationIndex = optionalRotationName
      ? this.determineRotationIndex(optionalRotationName)
      : 0;
    this.rotation = this.availableRotations[this.rotationIndex];
    this.preview = generatePreviewImgPath(this.shapeName);
  }

  drawShape = () => {
    this.blocks.forEach((block, index) => {
      if (this.rotation === "horizontal") {
        // handle ledges
        if (index > 0) {
          block.isBottomLedge = true;
        }

        if (index === 1 || index === 2) {
          block.isLeftLedge = true;
        }

        if (index === 0 || index === 3) {
          block.isRightLedge = true;
        }

        // handle coordinates
        if (index === 1) {
          // place directly to the left of anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 2) {
          // place directly beneath anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        } else if (index === 3) {
          // place bottom right of anchor
          block.xCoordinate = this.anchorBlock.xCoordinate + GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        }
      } else if (this.rotation === "vertical") {
        // handle ledges
        if (index === 0 || index === 3) {
          block.isBottomLedge = true;
        }

        if (index > 0) {
          block.isLeftLedge = true;
        }

        if (index !== 2) {
          block.isRightLedge = true;
        }
        // handle coordinates
        if (index === 1) {
          // place directly above anchor
          block.xCoordinate = this.anchorBlock.xCoordinate;
          block.yCoordinate = this.anchorBlock.yCoordinate - GRID_SPACE;
        } else if (index === 2) {
          // place directly to the left of anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate;
        } else if (index === 3) {
          // place bottom left of anchor
          block.xCoordinate = this.anchorBlock.xCoordinate - GRID_SPACE;
          block.yCoordinate = this.anchorBlock.yCoordinate + GRID_SPACE;
        }
      }
      block.drawBlock();
    });
  };

  checkForRotationConflict = (directionToRotate, game) => {
    const [anchorBlockRow, anchorBlockCol] = game.determineRowAndColumn(
      this.anchorBlock
    );
    if (game.reachedTopOfGrid(anchorBlockRow)) return true;
    const oneRowUp = anchorBlockRow - 1;
    const oneRowDown = anchorBlockRow + 1;
    const oneColLeft = anchorBlockCol - 1;
    const oneColRight = anchorBlockCol + 1;
    if (directionToRotate === "horizontal") {
      // we can only go out of range on the right side
      if (
        game.reachedRightSideOfGrid(anchorBlockCol) ||
        game.grid[oneRowDown][anchorBlockCol] ||
        game.grid[oneRowDown][oneColRight]
      ) {
        return true;
      }
    } else if (directionToRotate === "vertical") {
      // we don't have to worry about going out of range on the left, right, or bottom because we have pieces
      // to the left, right, and below the anchor in the current, horizontal, position
      if (
        game.grid[oneRowUp][anchorBlockCol] ||
        game.grid[oneRowDown][oneColLeft]
      ) {
        return true;
      }
    }
  };
}

export default Shape;
