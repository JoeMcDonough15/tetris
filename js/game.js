import { Line, Square, TShape, LShape, JShape } from "./shapes.js";
import { NUM_ROWS, NUM_COLS, GRID_SPACE } from "./gridSpecs.js";

class Game {
  constructor() {
    this.gameOver = false;
    this.level = 1;
    this.gameSpeed = 500;
    this.rowsCleared = 0;
    this.grid = new Array(NUM_ROWS);
    this.availablePieces = ["line", "square", "tShape", "lShape", "jShape"];
    this.currentPiece = null;

    for (let i = 0; i < this.grid.length; i++) {
      const newRow = new Array(NUM_COLS + 1).fill(null);
      newRow[newRow.length - 1] = 0; // last index acts as the column count so we can know if a row has cleared
      this.grid[i] = newRow;
    }
  }

  // Game methods

  addBlocksToGrid = () => {
    this.currentPiece.blocks.forEach((block) => {
      const [currentRow, currentCol] = this.determineRowAndColumn(block);
      this.grid[currentRow][currentCol] = block;
      const rowOfGrid = this.grid[currentRow];
      rowOfGrid[rowOfGrid.length - 1] += 1;
    });
  };

  destroyBlocksOfRow = (rowNum) => {
    const currentRow = this.grid[rowNum];
    currentRow.forEach((block, index) => {
      if (index <= currentRow.length - 2) {
        block.clearBlock();
        this.grid[rowNum][index] = null;
      }
    });
    // reset the cleared row's column count to 0
    currentRow[currentRow.length - 1] = 0;
  };

  moveRemainingBlocksDown = (clearedRowNum) => {
    for (let rowNum = clearedRowNum - 1; rowNum >= 0; rowNum--) {
      const rowToMove = this.grid[rowNum];
      rowToMove.forEach((currentBlock, index) => {
        if (index <= rowToMove.length - 2) {
          if (currentBlock) {
            currentBlock.moveBlockDownOneRow();
            rowToMove[index] = null;
            const nextRowDown = this.grid[rowNum + 1];
            nextRowDown[index] = currentBlock;
            nextRowDown[nextRowDown.length - 1] += 1;
          }
        }
      });
      rowToMove[rowToMove.length - 1] = 0;
    }
  };

  checkForClearedRows = () => {
    for (let rowNum = this.grid.length - 1; rowNum >= 0; rowNum--) {
      const row = this.grid[rowNum];
      while (row[row.length - 1] === NUM_COLS) {
        this.rowsCleared++;
        this.destroyBlocksOfRow(rowNum);
        this.moveRemainingBlocksDown(rowNum);
      }
    }
  };

  placePiece = (interval) => {
    clearInterval(interval);
    document.removeEventListener("keydown", this.pieceControllerEvents);
    this.addBlocksToGrid();
    this.checkForClearedRows();
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

  willCollide = (ledge) => {
    for (let i = 0; i < this.currentPiece.blocks.length; i++) {
      const currentBlock = this.currentPiece.blocks[i];

      if (
        (ledge === "bottom" && !currentBlock.isBottomLedge) ||
        (ledge === "left" && !currentBlock.isLeftLedge) ||
        (ledge === "right" && !currentBlock.isRightLedge)
      ) {
        continue;
      }

      const [currentRow, currentCol] = this.determineRowAndColumn(currentBlock);

      if (
        ledge === "bottom" &&
        (this.reachedBottomOfGrid(currentRow) ||
          this.grid[currentRow + 1][currentCol])
      ) {
        return true;
      } else if (
        ledge === "left" &&
        (this.reachedLeftSideOfGrid(currentCol) ||
          this.grid[currentRow][currentCol - 1])
      ) {
        return true;
      } else if (
        ledge === "right" &&
        (this.reachedRightSideOfGrid(currentCol) ||
          this.grid[currentRow][currentCol + 1])
      ) {
        return true;
      }
    }

    return false;
  };

  dropPiece = () => {
    const fallInterval = setInterval(() => {
      if (this.willCollide("bottom")) {
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
    if (this.willCollide("left")) return;
    this.currentPiece.clearShape();
    this.currentPiece.initialBlock.xCoordinate -= GRID_SPACE;
    this.currentPiece.drawShape();
  };

  movePieceRight = () => {
    if (this.willCollide("right")) return;
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
