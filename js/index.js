// Colors
const GREEN = "rgb(0 255 0)";
const BLUE = "rgb(0 100 255)";
const RED = "rgb(255 0 0)";
const YELLOW = "rgb(255 255 0)";
const ORANGE = "rgb(255 127 0)";
// Grid Specifications
const NUM_ROWS = 40;
const NUM_COLS = 30;
const GRID_SPACE = 20;
// Canvas
const canvas = document.getElementById("canvas");
canvas.width = NUM_COLS * GRID_SPACE; // 600
canvas.height = NUM_ROWS * GRID_SPACE; // 800
const ctx = canvas.getContext("2d");

class Block {
  constructor(xCoordinate, yCoordinate, color) {
    this.borderColor = "rgb(0 0 0)";
    this.fillColor = color;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
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
}

class Shape {
  constructor(colorString, startingOffset) {
    this.numBlocks = 4;
    this.shapeColor = colorString;
    this.blocks = [];
    for (let i = 0; i < this.numBlocks; i++) {
      const newBlock = new Block(
        Math.floor(canvas.width / 2 - startingOffset),
        0,
        this.shapeColor
      );
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

class Line extends Shape {
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

class Square extends Shape {
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

class TShape extends Shape {
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

class LShape extends Shape {
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

class JShape extends Shape {
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

class Game {
  constructor() {
    this.gameOver = false;
    this.level = 1;
    this.gameSpeed = 500;
    this.rowsCleared = 0;
    this.grid = new Array(NUM_ROWS); // will be a 2d array
    this.availablePieces = ["line", "square", "tShape", "lShape", "jShape"];
    this.currentPiece = null; // will be an instance of a specific sub class of Shape based on the strings in this.availablePieces

    // populate the 2d grid - O(1) Time and Space.  There is a set number of rows and columns, so despite the nested loop, none of this is based on user input, so the Big O analysis of this operation would be considered constant.
    for (let i = 0; i < this.grid.length; i++) {
      // set all columns to false to denote unoccupied grid spaces.
      const newRow = new Array(NUM_COLS + 1).fill(false);
      newRow[newRow.length - 1] = 0; // override the last false value with a number to be used as the number of columns occupied in each row, initialized to 0.
      this.grid[i] = newRow;
    }
  }

  // methods

  placePiece = (interval) => {
    // First, clear the event listeners from the current piece, and stop setInterval
    clearInterval(interval);
    document.removeEventListener("keydown", this.pieceControllerEvents);
    // Then, update the game grid based on this piece's placed position

    // Finally, select a new piece to fall, making it unnecessary to return out of dropPiece.
    this.selectNewPiece();
  };

  willCollideBottom = () => {
    for (let i = 0; i < this.currentPiece.blocks.length; i++) {
      const currentBlock = this.currentPiece.blocks[i];
      if (!currentBlock.isBottomLedge) continue;

      const currentRow = currentBlock.yCoordinate / GRID_SPACE;
      const currentCol = currentBlock.xCoordinate / GRID_SPACE;

      if (
        currentRow === this.grid.length - 1 ||
        this.grid[currentRow + 1][currentCol]
      ) {
        // if we are at the bottom of the grid, or if the grid is true at this position (meaning there's a shape occupying these coordinates)
        return true;
      }
    }
    return false;
  };

  willCollideLeft = () => {};

  willCollideRight = () => {};

  dropPiece = () => {
    const fallInterval = setInterval(() => {
      if (this.willCollideBottom()) {
        this.placePiece(fallInterval);
        return;
      }
      this.currentPiece.clearShape();
      this.currentPiece.initialBlock.yCoordinate += GRID_SPACE;
      this.currentPiece.drawShape();
    }, this.gameSpeed);

    document.addEventListener("keydown", this.pieceControllerEvents);
  };

  movePieceLeft = () => {
    if (this.currentPiece.leftLedge <= 0) return;
    this.currentPiece.clearShape();
    this.currentPiece.initialBlock.xCoordinate -= GRID_SPACE;
    this.currentPiece.drawShape();
  };

  movePieceRight = () => {
    if (this.currentPiece.rightLedge >= canvas.width) return;
    this.currentPiece.clearShape();
    this.currentPiece.initialBlock.xCoordinate += GRID_SPACE;
    this.currentPiece.drawShape();
  };

  pieceControllerEvents = (e) => {
    const keyName = e.key;
    if (keyName === "ArrowRight") {
      this.movePieceRight();
    } else if (keyName === "ArrowLeft") {
      this.movePieceLeft();
    } else if (keyName === "r") {
      this.currentPiece.rotate();
    }
  };

  selectNewPiece = () => {
    const generatedIndex = Math.floor(
      Math.random() * this.availablePieces.length
    );

    const pieceName = this.availablePieces[generatedIndex];
    let newPiece;
    if (pieceName === "line") {
      newPiece = new Line();
    } else if (pieceName === "square") {
      newPiece = new Square();
    } else if (pieceName === "tShape") {
      newPiece = new TShape();
    } else if (pieceName === "lShape") {
      newPiece = new LShape();
    } else if (pieceName === "jShape") {
      newPiece = new JShape();
    }

    this.currentPiece = newPiece;

    this.dropPiece();
  };

  // TODOS
  speedDown = () => {};
}

const game = new Game();

// for (let i = 0; i < game.grid.length; i++) {
// }

game.selectNewPiece(); // begins game
