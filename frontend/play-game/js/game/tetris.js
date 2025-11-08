import {
  GRID_SPACE,
  NUM_ROWS,
  NUM_COLS,
  availableShapes,
  updateElementTextById,
  updateImageSrcById,
  toggleDisplayById,
  injectValueToInputById,
  blockSound,
  rotateSound,
  clearedRowSound,
  openConfirmOverwriteGameModal,
  saveCanvas,
  drawPreviousCanvas,
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
import Block from "./block.js";
import GameGrid from "./gameGrid.js";

class Tetris {
  constructor(gameSettingsObj, highScoresObj, nameOfGameToLoad) {
    // APIs for settings and high scores
    this.gameSettings = gameSettingsObj;
    this.highScoresObj = highScoresObj;

    // Game State
    this.nameOfGameToLoad = nameOfGameToLoad; // possibly null
    this.nameOfGameToSave = null;
    this.indexOfGameToOverwrite = -1;
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

    // load game if it exists
    if (this.nameOfGameToLoad) {
      this.loadGame();
    }
  }

  // Game methods

  checkForSavedGame = (nameOfGameToSave) => {
    this.nameOfGameToSave = nameOfGameToSave;
    const existingGames = JSON.parse(window.localStorage.getItem("savedGames")); // possibly null

    if (existingGames) {
      const indexOfExistingGame = existingGames.findIndex(
        (savedGame) => savedGame.nameOfGame === nameOfGameToSave // will be index of the existing game or -1
      );

      if (indexOfExistingGame > -1) {
        this.indexOfGameToOverwrite = indexOfExistingGame;
        openConfirmOverwriteGameModal(this);
        return;
      }
    }

    this.saveGame();
  };

  saveGame = () => {
    const gameObj = {
      gameOver: this.gameOver,
      gameSpeed: this.gameSpeed,
      level: this.level,
      totalRowsCleared: this.totalRowsCleared,
      softDropPoints: this.softDropPoints,
      rowsCleared: this.rowsCleared,
      playerTotalScore: this.playerTotalScore,
      game: this.game,
      pieceQueue: this.pieceQueue,
      currentPiece: this.currentPiece,
      currentPiecePlaced: this.currentPiecePlaced,
      numRotations: this.numRotations,
    };

    const gameBoardString = saveCanvas();

    const gameToSave = {
      nameOfGame: this.nameOfGameToSave,
      gameObj,
      gameBoardString,
    };

    let allSavedGames = JSON.parse(window.localStorage.getItem("savedGames"));
    if (!allSavedGames) {
      allSavedGames = []; // if we are saving the first game
    }

    if (this.indexOfGameToOverwrite > -1) {
      allSavedGames.splice(this.indexOfGameToOverwrite, 1, gameToSave);
    } else {
      allSavedGames.push(gameToSave);
    }

    window.localStorage.setItem("savedGames", JSON.stringify(allSavedGames));

    this.nameOfGameToSave = null;
    this.indexOfGameToOverwrite = -1;
  };

  convertAllPreviouslyPlacedPiecesToBlocks = (loadedGrid) => {
    for (let i = 0; i < loadedGrid.length; i++) {
      const currentRow = loadedGrid[i];
      for (let j = 0; j < currentRow.length; j++) {
        const gridItem = loadedGrid[i][j];
        if (gridItem && isNaN(gridItem)) {
          const { xCoordinate, yCoordinate, fillColor: color } = gridItem;
          const newBlock = new Block(color, xCoordinate, yCoordinate);
          loadedGrid[i][j] = newBlock;
        }
      }
    }
    return loadedGrid;
  };

  loadGame = () => {
    const loadedGame = JSON.parse(localStorage.getItem("savedGames")).find(
      (game) => game.nameOfGame === this.nameOfGameToLoad
    );

    const loadedGameGrid = this.convertAllPreviouslyPlacedPiecesToBlocks(
      loadedGame.gameObj.game.grid
    );

    this.game = new GameGrid(NUM_ROWS, NUM_COLS, loadedGameGrid);
    this.gameOver = loadedGame.gameObj.gameOver;
    this.gameSpeed = loadedGame.gameObj.gameSpeed;
    this.level = loadedGame.gameObj.level;
    updateElementTextById("level-heading", `Level: ${this.level}`);
    this.totalRowsCleared = loadedGame.gameObj.totalRowsCleared;
    updateElementTextById(
      "rows-cleared-heading",
      `Rows: ${this.totalRowsCleared}`
    );
    this.softDropPoints = loadedGame.gameObj.softDropPoints;
    this.rowsCleared = loadedGame.gameObj.rowsCleared;
    this.playerTotalScore = loadedGame.gameObj.playerTotalScore;
    updateElementTextById(
      "total-score-heading",
      `Score: ${this.playerTotalScore}`
    );

    loadedGame.gameObj.pieceQueue.forEach((pieceInQueue) => {
      let nextPieceForQueue;
      if (pieceInQueue.shapeName === "line") {
        nextPieceForQueue = new Line();
      } else if (pieceInQueue.shapeName === "square") {
        nextPieceForQueue = new Square();
      } else if (pieceInQueue.shapeName === "tShape") {
        nextPieceForQueue = new TShape();
      } else if (pieceInQueue.shapeName === "lShape") {
        nextPieceForQueue = new LShape();
      } else if (pieceInQueue.shapeName === "jShape") {
        nextPieceForQueue = new JShape();
      } else if (pieceInQueue.shapeName === "sShape") {
        nextPieceForQueue = new SShape();
      } else if (pieceInQueue.shapeName === "zShape") {
        nextPieceForQueue = new ZShape();
      }
      this.pieceQueue.push(nextPieceForQueue);
    });
    // now set the preview-img to be the first shape in the queue
    updateImageSrcById("preview-img", this.pieceQueue[0].preview);

    // now, set up the currentPiece.  Grab its x and y coordinates and instantiate the shape that it is with those coordinates in the rotation it was in when game was saved.
    const previousXCoordinate =
      loadedGame.gameObj.currentPiece.anchorBlock.xCoordinate;
    const previousYCoordinate =
      loadedGame.gameObj.currentPiece.anchorBlock.yCoordinate;
    const previousRotationName = loadedGame.gameObj.currentPiece.rotation;

    if (loadedGame.gameObj.currentPiece.shapeName === "line") {
      this.currentPiece = new Line(
        previousXCoordinate,
        previousYCoordinate,
        previousRotationName
      );
    } else if (loadedGame.gameObj.currentPiece.shapeName === "square") {
      this.currentPiece = new Square(
        previousXCoordinate,
        previousYCoordinate,
        previousRotationName
      );
    } else if (loadedGame.gameObj.currentPiece.shapeName === "tShape") {
      this.currentPiece = new TShape(
        previousXCoordinate,
        previousYCoordinate,
        previousRotationName
      );
    } else if (loadedGame.gameObj.currentPiece.shapeName === "lShape") {
      this.currentPiece = new LShape(
        previousXCoordinate,
        previousYCoordinate,
        previousRotationName
      );
    } else if (loadedGame.gameObj.currentPiece.shapeName === "jShape") {
      this.currentPiece = new JShape(
        previousXCoordinate,
        previousYCoordinate,
        previousRotationName
      );
    } else if (loadedGame.gameObj.currentPiece.shapeName === "sShape") {
      this.currentPiece = new SShape(
        previousXCoordinate,
        previousYCoordinate,
        previousRotationName
      );
    } else if (loadedGame.gameObj.currentPiece.shapeName === "zShape") {
      this.currentPiece = new ZShape(
        previousXCoordinate,
        previousYCoordinate,
        previousRotationName
      );
    }

    // now, draw that shape to the board to replace the existing one
    this.currentPiece.drawShape();

    this.currentPiecePlaced = loadedGame.gameObj.currentPiecePlaced;
    this.numRotations = loadedGame.gameObj.numRotations;

    drawPreviousCanvas(loadedGame.gameBoardString);
  };

  startGame = () => {
    if (this.nameOfGameToLoad) {
      this.loadGame();
      this.gravityDrop();
    } else {
      this.dequeuePiece();
    }
  };

  quitGame = () => {
    window.location.replace("/");
  };

  endGame = () => {
    this.gameOver = true;
    toggleDisplayById("game-grid-container", "game-details-container");
    updateElementTextById("main-heading", "Game Over");
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
      toggleDisplayById("player-name-form");
      injectValueToInputById("player-score", this.playerTotalScore);

      if (existingHighScores.length === 10) {
        this.idOfScoreToRemove = lastPlaceScoreObj.id; // never keep more than 10 high scores in the database
      }
    } else {
      toggleDisplayById("post-game-menu-buttons");
    }
  };

  togglePause = () => {
    this.gamePaused = !this.gamePaused;
    if (!this.gamePaused) {
      this.gravityDrop();
    }
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
    updateElementTextById(
      "total-score-heading",
      `Score: ${this.playerTotalScore}`
    );
  };

  updateRowsCleared = () => {
    if (!this.rowsCleared) return;
    if (this.gameSettings.soundFx === "on") {
      clearedRowSound.play();
    }
    this.totalRowsCleared += this.rowsCleared;
    updateElementTextById(
      "rows-cleared-heading",
      `Rows: ${this.totalRowsCleared}`
    );
    if (this.level < 9 && this.clearedTenRows()) {
      this.levelUp();
    } else if (this.level >= 9 && this.clearedTwentyRows()) {
      this.levelUp();
    }
  };

  levelUp = () => {
    this.level++;
    updateElementTextById("level-heading", `Level: ${this.level}`);
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
      blockSound.play();
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
      if (this.currentPiecePlaced || this.gamePaused) {
        clearInterval(fallInterval);
        if (!this.gameOver && !this.gamePaused) {
          this.dequeuePiece();
        }
        return;
      }
      this.moveShape("down");
    }, this.gameSpeed);
  };

  moveShape = (direction) => {
    if (this.willCollide(direction === "down" ? "bottom" : direction)) {
      if (direction === "down") {
        this.placePiece();
      }

      return;
    }

    // clear the shape
    this.currentPiece.clearShape();

    // move the shape
    if (direction === "left") {
      this.currentPiece.anchorBlock.xCoordinate -= GRID_SPACE;
    } else if (direction === "right") {
      this.currentPiece.anchorBlock.xCoordinate += GRID_SPACE;
    } else if (direction === "down") {
      this.currentPiece.anchorBlock.yCoordinate += GRID_SPACE;
    }

    // redraw the shape in its new position
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
      rotateSound.play();
    }
    this.numRotations++;
    this.currentPiece.rotate(this.numRotations);
  };

  instantiateShape = (shapeName) => {
    let newPiece;
    if (shapeName === "line") {
      newPiece = new Line();
    } else if (shapeName === "square") {
      newPiece = new Square();
    } else if (shapeName === "tShape") {
      newPiece = new TShape();
    } else if (shapeName === "lShape") {
      newPiece = new LShape();
    } else if (shapeName === "jShape") {
      newPiece = new JShape();
    } else if (shapeName === "sShape") {
      newPiece = new SShape();
    } else if (shapeName === "zShape") {
      newPiece = new ZShape();
    }

    return newPiece;
  };

  addPieceToQueue = () => {
    const generatedIndex = Math.floor(Math.random() * availableShapes.length);
    const pieceName = availableShapes[generatedIndex];
    this.pieceQueue.push(pieceName);
  };

  dequeuePiece = () => {
    if (!this.pieceQueue.length) {
      for (let i = 0; i < 2; i++) {
        this.addPieceToQueue();
      }
    } else {
      this.addPieceToQueue();
    }

    const nameOfNextShape = this.pieceQueue.shift();
    this.currentPiece = this.instantiateShape(nameOfNextShape);
    const nextPieceInQueue = this.pieceQueue[0];
    updateImageSrcById("preview-img", nextPieceInQueue);

    this.currentPiecePlaced = false;
    this.numRotations = 0;
    this.gravityDrop();
  };
}

export default Tetris;
