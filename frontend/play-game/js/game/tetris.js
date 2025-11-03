import {
  GRID_SPACE,
  NUM_ROWS,
  NUM_COLS,
  displayCurrentSettingsOnForm,
  availableShapes,
  generateSoundPath,
} from "../../../utils/index.js";
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
import { createPlayerNameForm } from "../../../components/index.js";

class Tetris {
  constructor(
    gameSettingsObj,
    highScoresObj,
    settingsModal,
    playGameContainer,
    gameGridContainer,
    gameDetailsContainer,
    mainHeading,
    previewImg,
    levelHeading,
    totalScoreHeading,
    rowsClearedHeading,
    postGameMenuButtons
  ) {
    // APIs for settings and high scores
    this.gameSettings = gameSettingsObj;
    this.highScoresObj = highScoresObj;
    // DOM Elements
    this.settingsModal = settingsModal;
    this.playGameContainer = playGameContainer;
    this.gameGridContainer = gameGridContainer;
    this.gameDetailsContainer = gameDetailsContainer;
    this.mainHeading = mainHeading;
    this.previewImg = previewImg;
    this.levelHeading = levelHeading;
    this.totalScoreHeading = totalScoreHeading;
    this.rowsClearedHeading = rowsClearedHeading;
    this.postGameMenuButtons = postGameMenuButtons;
    // Game State
    this.gameOver = false;
    this.gamePaused = false;
    this.gameSpeed = 400;
    this.level = 0;
    this.totalRowsCleared = 0;
    this.softDropPoints = 0;
    this.rowsCleared = 0;
    this.playerTotalScore = 0;
    this.idOfScoreToRemove = "";
    this.game = new GameGrid(NUM_ROWS, NUM_COLS);
    this.pieceQueue = [];
    this.currentPiece = null;
    this.currentPiecePlaced = false;
    this.numRotations = 0;
    // Sound Fx Files
    this.blockSound = new Audio(generateSoundPath("block-landing"));
    this.rotateSound = new Audio(generateSoundPath("rotate"));
    this.clearedRowSound = new Audio(generateSoundPath("cleared-row"));
  }

  // Game methods

  startGame = () => {
    this.dequeuePiece();
  };

  endGame = () => {
    this.gameOver = true;
    this.gameGridContainer.remove();
    this.gameDetailsContainer.remove();
    this.mainHeading.innerText = "Game Over";
    this.checkForHighScore();
  };

  checkForHighScore = async () => {
    const existingHighScores = await this.highScoresObj.getHighScores();
    const lastPlaceScoreObj = existingHighScores[existingHighScores.length - 1];
    const highScoreAchieved =
      this.playerTotalScore &&
      (existingHighScores.length < 10 ||
        (lastPlaceScoreObj && this.playerTotalScore > lastPlaceScoreObj.score));

    if (highScoreAchieved) {
      const playerNameForm = createPlayerNameForm(
        this.submitHighScore,
        this.playerTotalScore
      );
      this.playGameContainer.prepend(playerNameForm);

      if (existingHighScores.length === 10) {
        this.idOfScoreToRemove = lastPlaceScoreObj.id; // never keep more than 10 high scores in the database
      }
    } else {
      this.playGameContainer.prepend(this.postGameMenuButtons);
    }
  };

  submitHighScore = async () => {
    const playerNameForm = document.getElementById("player-name-form");
    const playerName = playerNameForm.element.playerName.value;
    const playerScore = playerNameForm.elements.playerScore.value;

    const playerDetails = {
      name: playerName,
      score: playerScore,
    };

    if (this.idOfScoreToRemove) {
      await this.highScoresObj.removeHighScore(this.idOfScoreToRemove);
    }

    await this.highScoresObj.addScoreToHighScores(playerDetails);

    this.playGameContainer.removeChild(playerNameForm);
    this.playGameContainer.appendChild(this.postGameMenuButtons);
  };

  togglePause = () => {
    if (!this.gamePaused) {
      displayCurrentSettingsOnForm(this.gameSettings);
      // TODO clear any error state
      this.settingsModal.showModal();
    } else {
      this.settingsModal.close();
    }

    this.gamePaused = !this.gamePaused;
  };

  addBlocksToGrid = () => {
    this.currentPiece.blocks.forEach((block) => {
      const [currentRow, currentCol] = this.game.determineRowAndColumn(block);
      if (this.game.reachedTopOfGrid(currentRow)) {
        this.endGame();
        return;
      }
      this.game.grid[currentRow][currentCol] = block;
      const rowOfGrid = this.game.grid[currentRow];
      rowOfGrid[rowOfGrid.length - 1] += 1;
    });
  };

  destroyBlocksOfRow = (rowNum) => {
    const currentRow = this.game.grid[rowNum];
    currentRow.forEach((block, index) => {
      if (index < currentRow.length - 1) {
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
        if (index < rowToMove.length - 1) {
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

  awardPoints = () => {
    return;
    let awardedPoints = 0;
    if (this.rowsCleared === 1) {
      awardedPoints += 40;
    } else if (this.rowsCleared === 2) {
      awardedPoints += 100;
    } else if (this.rowsCleared === 3) {
      awardedPoints += 300;
    } else if (this.rowsCleared === 4) {
      awardedPoints += 1200;
    }
    this.playerTotalScore +=
      awardedPoints * (this.level + 1) + this.softDropPoints;
    this.totalScoreHeading.innerText = `Score: ${this.playerTotalScore}`;
  };

  updateRowsCleared = () => {
    if (!this.rowsCleared) return;
    if (this.gameSettings.soundFx === "on") {
      this.clearedRowSound.play();
    }
    this.totalRowsCleared += this.rowsCleared;
    this.rowsClearedHeading.innerText = `Rows: ${this.totalRowsCleared}`;
    if (this.level < 9 && this.clearedTenRows()) {
      this.levelUp();
    } else if (this.level >= 9 && this.clearedTwentyRows()) {
      this.levelUp();
    }
  };

  levelUp = () => {
    this.level++;
    this.levelHeading.innerText = `Level: ${this.level}`;
    this.gameSpeed -= 50;
  };

  checkForClearedRows = () => {
    for (let rowNum = NUM_ROWS - 1; rowNum >= 0; rowNum--) {
      const row = this.game.grid[rowNum];
      while (row[row.length - 1] === NUM_COLS) {
        this.rowsCleared++;
        this.destroyBlocksOfRow(rowNum);
        this.moveRemainingBlocksDown(rowNum);
      }
    }
  };

  placePiece = () => {
    if (this.gameSettings.soundFx === "on") {
      this.blockSound.play();
    }
    this.addBlocksToGrid();
    this.checkForClearedRows();
    this.updateRowsCleared();
    this.awardPoints();
    this.rowsCleared = 0;
    this.softDropPoints = 0;
    this.currentPiecePlaced = true;
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

  gravityDrop = () => {
    const fallInterval = setInterval(() => {
      if (this.currentPiecePlaced) {
        clearInterval(fallInterval);
        if (!this.gameOver) {
          this.dequeuePiece();
        }
        return;
      }
      this.moveShape("down");
    }, this.gameSpeed);
  };

  moveShape = (direction) => {
    if (this.currentPiecePlaced || this.gamePaused) {
      return;
    }

    if (this.willCollide(direction === "down" ? "bottom" : direction)) {
      if (direction === "down") {
        this.placePiece();
      }
      return;
    }
    this.currentPiece.clearShape();
    if (direction === "left") {
      this.currentPiece.anchorBlock.xCoordinate -= GRID_SPACE;
    } else if (direction === "right") {
      this.currentPiece.anchorBlock.xCoordinate += GRID_SPACE;
    } else if (direction === "down") {
      this.currentPiece.anchorBlock.yCoordinate += GRID_SPACE;
    }
    this.currentPiece.drawShape();
  };

  softDrop = () => {
    this.moveShape("down");
    this.softDropPoints++;
  };

  rotationPermitted = () => {
    const shapeName = this.currentPiece.shapeName;
    if (shapeName === "square" || this.gamePaused || this.currentPiecePlaced) {
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
    if (this.gameSettings.soundFx === "on") {
      this.rotateSound.play();
    }
    this.numRotations++;
    this.currentPiece.rotate(this.numRotations);
  };

  selectNewPiece = () => {
    const generatedIndex = Math.floor(Math.random() * availableShapes.length);

    const pieceName = availableShapes[generatedIndex];

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

    return newPiece;
  };

  addPieceToQueue = () => {
    const newPiece = this.selectNewPiece();
    this.pieceQueue.push(newPiece);
  };

  setPreviewOfNextPiece = () => {
    this.previewImg.setAttribute("src", this.pieceQueue[0].preview);
  };

  dequeuePiece = () => {
    if (!this.pieceQueue.length) {
      for (let i = 0; i < 2; i++) {
        this.addPieceToQueue();
      }
    } else {
      this.addPieceToQueue();
    }

    this.currentPiece = this.pieceQueue.shift();
    this.setPreviewOfNextPiece();

    this.currentPiecePlaced = false;
    this.numRotations = 0;
    this.currentPiece.drawShape();
    this.gravityDrop();
  };
}

export default Tetris;
