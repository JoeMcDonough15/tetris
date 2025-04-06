import { Line, Square, TShape, LShape, JShape } from "./shapes.js";
import {
  NUM_ROWS,
  NUM_COLS,
  GRID_SPACE,
  reachedBottomOfGrid,
  reachedLeftSideOfGrid,
  reachedRightSideOfGrid,
  determineRowAndColumn,
} from "./gridSpecs.js";

const levelHeading = document.getElementById("level-heading");
const rowsClearedHeading = document.getElementById("rows-cleared-heading");

class Game {
  constructor() {
    this.gameOver = false;
    this.level = 1;
    this.gameSpeed = 1000;
    this.rowsCleared = 0;
    this.grid = new Array(NUM_ROWS);
    this.availablePieces = ["line", "square", "tShape", "lShape", "jShape"];
    this.currentPiece = null;
    this.numRotations = 0;

    for (let i = 0; i < this.grid.length; i++) {
      const newRow = new Array(NUM_COLS + 1).fill(null);
      newRow[newRow.length - 1] = 0; // last index acts as the column count so we can know if a row has cleared
      this.grid[i] = newRow;
    }
  }

  // Game methods

  addBlocksToGrid = () => {
    this.currentPiece.blocks.forEach((block) => {
      const [currentRow, currentCol] = determineRowAndColumn(block);
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

  updateRowsCleared = () => {
    this.rowsCleared++;
    rowsClearedHeading.innerText = `Rows Cleared: ${this.rowsCleared}`;
    if (this.rowsCleared >= 5 && this.rowsCleared % 5 === 0) {
      this.levelUp();
    }
  };

  levelUp = () => {
    this.level++;
    levelHeading.innerText = `Level: ${this.level}`;
    this.gameSpeed -= 50;
  };

  checkForClearedRows = () => {
    for (let rowNum = this.grid.length - 1; rowNum >= 0; rowNum--) {
      const row = this.grid[rowNum];
      while (row[row.length - 1] === NUM_COLS) {
        this.updateRowsCleared();
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

      const [currentRow, currentCol] = determineRowAndColumn(currentBlock);

      if (
        ledge === "bottom" &&
        (reachedBottomOfGrid(currentRow) ||
          this.grid[currentRow + 1][currentCol])
      ) {
        return true;
      } else if (
        ledge === "left" &&
        (reachedLeftSideOfGrid(currentCol) ||
          this.grid[currentRow][currentCol - 1])
      ) {
        return true;
      } else if (
        ledge === "right" &&
        (reachedRightSideOfGrid(currentCol) ||
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
      this.currentPiece.anchorBlock.yCoordinate += GRID_SPACE;
      this.currentPiece.drawShape();
    }, this.gameSpeed);

    document.addEventListener("keydown", this.pieceControllerEvents);
  };

  movePieceLeft = () => {
    if (this.willCollide("left")) return;
    this.currentPiece.clearShape();
    this.currentPiece.anchorBlock.xCoordinate -= GRID_SPACE;
    this.currentPiece.drawShape();
  };

  movePieceRight = () => {
    if (this.willCollide("right")) return;
    this.currentPiece.clearShape();
    this.currentPiece.anchorBlock.xCoordinate += GRID_SPACE;
    this.currentPiece.drawShape();
  };

  rotationPermitted = () => {
    const shapeName = this.currentPiece.shapeName;
    if (shapeName === "square") {
      return false;
    }
    const availableRotations = this.currentPiece.availableRotations;
    const nextRotationNum = this.numRotations + 1;
    const nextRotation =
      availableRotations[nextRotationNum % availableRotations.length];

    if (this.currentPiece.checkForRotationConflict(nextRotation, this.grid)) {
      return false;
    }

    // } else if (shapeName === "jShape") {
    //   if (nextRotation === "up") {
    //   } else if (nextRotation === "down") {
    //   } else if (nextRotation === "left") {
    //   } else if (nextRotation === "right") {
    //   }
    // }

    return true;
  };

  rotatePiece = () => {
    if (!this.rotationPermitted()) return;
    this.numRotations++;
    this.currentPiece.rotate(this.numRotations);
  };

  pieceControllerEvents = (e) => {
    const keyName = e.key;
    if (keyName === "ArrowRight") {
      this.movePieceRight();
    } else if (keyName === "ArrowLeft") {
      this.movePieceLeft();
    } else if (keyName === "r" || keyName === "ArrowUp") {
      this.rotatePiece();
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
