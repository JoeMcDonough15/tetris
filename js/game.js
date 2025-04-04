import { Line, Square, TShape, LShape, JShape } from "./shapes.js";
import { NUM_ROWS, NUM_COLS, GRID_SPACE } from "./gridSpecs.js";

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

  addBlocksToGrid = () => {
    this.currentPiece.blocks.forEach((block) => {
      // run forEach over all the blocks of the shape.  Grab each block's currentRow and currentCol
      const [currentRow, currentCol] = this.determineRowAndColumn(block);
      // update the grid to put a true at each of the coordinates that are now occupied.
      this.grid[currentRow][currentCol] = true;
      // increment the number at the end of the currentRow, documenting that column(s) from that row have been occupied.
      const rowOfGrid = this.grid[currentRow];
      rowOfGrid[rowOfGrid.length - 1] += 1;
    });
  };

  placePiece = (interval) => {
    // First, clear the event listeners from the current piece, and stop setInterval
    clearInterval(interval);
    document.removeEventListener("keydown", this.pieceControllerEvents);
    // Then, update the game grid based on this piece's placed position
    this.addBlocksToGrid();
    // check to see if we have a cleared a row when this piece was placed
    // we clear a row if a row of the grid ever reaches a number 30 at its last index

    // Finally, select a new piece to fall, making it unnecessary to return out of dropPiece.
    this.selectNewPiece();
  };

  determineRowAndColumn = (block) => {
    const currentRow = block.yCoordinate / GRID_SPACE;
    const currentCol = block.xCoordinate / GRID_SPACE;
    return [currentRow, currentCol];
  };

  reachedBottomOfGrid = (rowNum) => rowNum === NUM_ROWS - 1;

  reachedLeftSideOfGrid = (colNum) => colNum === 0;

  reachedRightSideOfGrid = (colNum) => colNum === NUM_COLS - 1;

  willCollideBottom = () => {
    for (let i = 0; i < this.currentPiece.blocks.length; i++) {
      const currentBlock = this.currentPiece.blocks[i];
      if (!currentBlock.isBottomLedge) continue;

      const [currentRow, currentCol] = this.determineRowAndColumn(currentBlock);

      if (
        this.reachedBottomOfGrid(currentRow) ||
        this.grid[currentRow + 1][currentCol]
      ) {
        // if we are at the bottom of the grid, or if the grid is true at this position (meaning there's a shape occupying these coordinates)
        return true;
      }
    }
    return false;
  };

  willCollideLeft = () => {
    // this should work like willCollideBottom, but deal with the left ledge blocks
    for (let i = 0; i < this.currentPiece.blocks.length; i++) {
      const currentBlock = this.currentPiece.blocks[i];
      if (!currentBlock.isLeftLedge) continue;

      const [currentRow, currentCol] = this.determineRowAndColumn(currentBlock);

      if (
        this.reachedLeftSideOfGrid(currentCol) ||
        this.grid[currentRow][currentCol - 1]
      ) {
        return true;
      }
    }
    return false;
  };

  willCollideRight = () => {
    // this should work like willCollideBottom, but deal with the right ledge blocks
    for (let i = 0; i < this.currentPiece.blocks.length; i++) {
      const currentBlock = this.currentPiece.blocks[i];
      if (!currentBlock.isRightLedge) continue;

      const [currentRow, currentCol] = this.determineRowAndColumn(currentBlock);

      if (
        this.reachedRightSideOfGrid(currentCol) ||
        this.grid[currentRow][currentCol + 1]
      ) {
        return true;
      }
    }
    return false;
  };

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
    if (this.willCollideLeft()) return;
    this.currentPiece.clearShape();
    this.currentPiece.initialBlock.xCoordinate -= GRID_SPACE;
    this.currentPiece.drawShape();
  };

  movePieceRight = () => {
    if (this.willCollideRight()) return;
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

export default Game;
