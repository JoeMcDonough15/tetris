import {
  Line,
  Square,
  TShape,
  LShape,
  JShape,
  SShape,
  ZShape,
} from "./shapes.js";
import GameGrid from "./gameGrid.js";
import { GRID_SPACE, NUM_ROWS, NUM_COLS } from "./constants.js";

const subHeadersContainer = document.getElementById("sub-headers-container");
const levelHeading = document.getElementById("level-heading");
const totalScoreHeading = document.getElementById("total-score-heading");
const rowsClearedHeading = document.getElementById("rows-cleared-heading");

class Tetris {
  constructor() {
    this.gameOver = false;
    this.gameSpeed = 400;
    this.level = 0;
    this.totalRowsCleared = 0;
    this.playerTotalScore = 0;
    this.game = new GameGrid(NUM_ROWS, NUM_COLS);
    this.availablePieces = [
      "line",
      "square",
      "tShape",
      "lShape",
      "jShape",
      "sShape",
      "zShape",
    ];
    this.pieceQueue = [];
    this.currentPiece = null;
    this.numRotations = 0;
  }

  // Game methods

  addBlocksToGrid = () => {
    this.currentPiece.blocks.forEach((block) => {
      const [currentRow, currentCol] = this.game.determineRowAndColumn(block);
      this.game.grid[currentRow][currentCol] = block;
      const rowOfGrid = this.game.grid[currentRow];
      rowOfGrid[rowOfGrid.length - 1] += 1;
    });
  };

  destroyBlocksOfRow = (rowNum) => {
    const currentRow = this.game.grid[rowNum];
    currentRow.forEach((block, index) => {
      if (index <= currentRow.length - 2) {
        block.clearBlock();
        this.game.grid[rowNum][index] = null;
      }
    });
    // reset the cleared row's column count to 0
    currentRow[currentRow.length - 1] = 0;
  };

  moveRemainingBlocksDown = (clearedRowNum) => {
    for (let rowNum = clearedRowNum - 1; rowNum >= 0; rowNum--) {
      const rowToMove = this.game.grid[rowNum];
      rowToMove.forEach((currentBlock, index) => {
        if (index <= rowToMove.length - 2) {
          if (currentBlock) {
            currentBlock.moveBlockDownOneRow();
            rowToMove[index] = null;
            const nextRowDown = this.game.grid[rowNum + 1];
            nextRowDown[index] = currentBlock;
            nextRowDown[nextRowDown.length - 1] += 1;
          }
        }
      });
      rowToMove[rowToMove.length - 1] = 0;
    }
  };

  clearedTenRows = () => {
    return this.totalRowsCleared >= 10 && this.totalRowsCleared % 10 === 0;
  };

  clearedTwentyRows = () => {
    return this.totalRowsCleared >= 20 && this.totalRowsCleared % 20 === 0;
  };

  awardPoints = (rows) => {
    let awardedPoints;
    if (rows === 1) {
      awardedPoints = 40;
    } else if (rows === 2) {
      awardedPoints = 100;
    } else if (rows === 3) {
      awardedPoints = 300;
    } else if (rows === 4) {
      awardedPoints = 1200;
    }
    this.playerTotalScore += awardedPoints * (this.level + 1);
    totalScoreHeading.innerText = `Total Score: ${this.playerTotalScore}`;
  };

  updateRowsCleared = (rows) => {
    this.totalRowsCleared += rows;
    rowsClearedHeading.innerText = `Rows Cleared: ${this.totalRowsCleared}`;
    if (this.level < 9 && this.clearedTenRows()) {
      this.levelUp();
    } else if (this.level >= 9 && this.clearedTwentyRows()) {
      this.levelUp();
    }
  };

  levelUp = () => {
    this.level++;
    levelHeading.innerText = `Level: ${this.level}`;
    this.gameSpeed -= 50;
  };

  checkForClearedRows = () => {
    let rowsCleared = 0;
    for (let rowNum = this.game.grid.length - 1; rowNum >= 0; rowNum--) {
      const row = this.game.grid[rowNum];
      while (row[row.length - 1] === NUM_COLS) {
        rowsCleared++;
        this.destroyBlocksOfRow(rowNum);
        this.moveRemainingBlocksDown(rowNum);
      }
    }
    if (rowsCleared) {
      this.updateRowsCleared(rowsCleared);
      this.awardPoints(rowsCleared);
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

      const [currentRow, currentCol] =
        this.game.determineRowAndColumn(currentBlock);

      if (
        ledge === "bottom" &&
        (this.game.reachedBottomOfGrid(currentRow) ||
          this.game.grid[currentRow + 1][currentCol])
      ) {
        return true;
      } else if (
        ledge === "left" &&
        (this.game.reachedLeftSideOfGrid(currentCol) ||
          this.game.grid[currentRow][currentCol - 1])
      ) {
        return true;
      } else if (
        ledge === "right" &&
        (this.game.reachedRightSideOfGrid(currentCol) ||
          this.game.grid[currentRow][currentCol + 1])
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

    if (this.currentPiece.checkForRotationConflict(nextRotation, this.game)) {
      return false;
    }

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

  addPieceToQueue = () => {
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
    } else if (pieceName === "sShape") {
      newPiece = new SShape();
    } else if (pieceName === "zShape") {
      newPiece = new ZShape();
    }
    this.pieceQueue.push(newPiece);
  };

  setPreviewOfNextPiece = () => {
    const childrenOfSubHeadersContainer = subHeadersContainer.children;
    const existingPreviewImg = childrenOfSubHeadersContainer[3];
    if (existingPreviewImg) {
      subHeadersContainer.removeChild(existingPreviewImg);
    }
    const previewImg = document.createElement("img");
    previewImg.setAttribute(
      "src",
      `/images/${this.pieceQueue[0].shapeName}-preview.png`
    );
    previewImg.setAttribute("alt", "preview-of-next-shape");
    subHeadersContainer.appendChild(previewImg);
  };

  selectNewPiece = () => {
    if (!this.pieceQueue.length) {
      for (let i = 0; i < 2; i++) {
        this.addPieceToQueue();
      }
    } else {
      this.addPieceToQueue();
    }

    this.currentPiece = this.pieceQueue.shift();
    this.setPreviewOfNextPiece();

    this.dropPiece();
  };

  // TODOS
  speedDown = () => {};
}

export default Tetris;
