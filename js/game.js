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
      // set all columns to null to denote unoccupied grid spaces.
      const newRow = new Array(NUM_COLS + 1).fill(null);
      newRow[newRow.length - 1] = 0; // override the last null value with a number to be used as the number of columns occupied in each row, initialized to 0.
      this.grid[i] = newRow;
    }
  }

  // methods

  addBlocksToGrid = () => {
    this.currentPiece.blocks.forEach((block) => {
      // run forEach over all the blocks of the shape.  Grab each block's currentRow and currentCol
      const [currentRow, currentCol] = this.determineRowAndColumn(block);
      // update the grid to put a true at each of the coordinates that are now occupied.
      this.grid[currentRow][currentCol] = block;
      // increment the number at the end of the currentRow, documenting that column(s) from that row have been occupied with block(s).
      const rowOfGrid = this.grid[currentRow];
      rowOfGrid[rowOfGrid.length - 1] += 1;
    });
  };

  destroyBlocksOfRow = (rowNum) => {
    this.grid[rowNum].forEach((block, index) => {
      if (index <= this.grid[rowNum].length - 2) {
        // if the index is not the final one, then it's a block
        block.clearBlock(); // clear block from the canvas
        this.grid[rowNum][index] = null; // replace the block that was at this column with null
      }
    });
    // reset the cleared row's column count to 0
    this.grid[rowNum][this.grid[rowNum].length - 1] = 0;
  };

  moveRemainingBlocksDown = (clearedRowNum) => {
    // any blocks in any rows above this rowNum should move down one row
    for (let rowNum = clearedRowNum - 1; rowNum >= 0; rowNum--) {
      // store the current row of the grid
      const rowToMove = this.grid[rowNum];
      // iterate over this currentRow
      rowToMove.forEach((currentBlock, index) => {
        // if we are not on the last index, so not the column count
        if (index <= rowToMove.length - 2) {
          // if there is a block at this column, so if it's not null
          if (currentBlock) {
            // call the moveBlockDownOneRow method on block so it can move independent of the shape it belonged to before
            currentBlock.moveBlockDownOneRow(); // paint this block one row lower on the canvas
            // replace this column with null and set the exact column one row lower to be this currentBlock we stored on line 54
            rowToMove[index] = null; // this block does not exist on this column anymore
            this.grid[rowNum + 1][index] = currentBlock; // this block now exists on the column one row lower
            this.grid[rowNum + 1][this.grid[rowNum + 1].length - 1] += 1; // increment the number of occupied columns in the next row down, since this block moved to that row
          }
        }
      });
      // reset the currentRow's column count to 0 since any blocks in this row moved down one row
      rowToMove[rowToMove.length - 1] = 0;
    }
    // now that the blocks have shifted down, check for more cleared rows
    this.checkForClearedRows();
  };

  checkForClearedRows = () => {
    // iterate from the bottom up through the grid, checking each row to see if it is full of blocks
    for (let rowNum = this.grid.length - 1; rowNum >= 0; rowNum--) {
      const row = this.grid[rowNum];
      // if the row's column count is the NUM_COLS, that means every column is occupied
      if (row[row.length - 1] === NUM_COLS) {
        // update the rowsCleared
        this.rowsCleared++;
        // since this row has now cleared, we remove all of its blocks from the canvas
        this.destroyBlocksOfRow(rowNum);
        // then, any blocks above this rowNum should move down to take the place of the now emptied row
        this.moveRemainingBlocksDown(rowNum);
      }
    }
  };

  placePiece = (interval) => {
    // First, clear the event listeners from the current piece, and stop setInterval
    clearInterval(interval);
    document.removeEventListener("keydown", this.pieceControllerEvents);
    // Then, update the game grid based on this piece's placed position
    this.addBlocksToGrid();
    // check to see if we have a cleared a row when this piece was placed
    // we clear a row if a row of the grid ever reaches the NUM_COLS at its last index
    this.checkForClearedRows();
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
