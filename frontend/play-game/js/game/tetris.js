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
  confirmOverwriteGame,
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

class Tetris {
  constructor(gameSettingsObj, highScoresObj, nameOfGameToLoad) {
    // APIs for settings and high scores
    this.gameSettings = gameSettingsObj;
    this.highScoresObj = highScoresObj;

    // Game State
    this.nameOfGame = nameOfGameToLoad; // possibly null
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
    if (this.nameOfGame) {
      this.loadGame();
    }
  }

  // Game methods

  checkForSavedGame = (nameOfGameToSave) => {
    const existingGame = window.localStorage.getItem(nameOfGameToSave);
    if (existingGame) {
      confirmOverwriteGame();
      return;
    }
    this.saveGame(nameOfGameToSave);
  };

  saveGame = (nameOfGameToSave) => {
    console.log("proceed to save game into local storage!");
    // this is called only when the form submits, inside an event listener on play-game/index.js
    // On pause menu, a button called Save Game must be clicked rendering a form to take in the name of the game to save.
    // On successful submission of that form, this method is called: game.saveGame(nameOfGameFromTextInput);
    // this method grabs all the current game state and puts it in an object called gameObj
    // it also saves the state of the canvas with a utility function that targets the canvas element by id, and copies
    // its data using canvas.toDataURL('image/png'), returning a string. This function could be called saveCanvas() or something like that.
    // Both the gameObj and the gameBoard get stored in one object with one property called nameOfGameToSave.
    // The value to that single property would look like this:
    //   const gameToSave =  { gameObj: { ...allGameState },
    //                         gameBoardString: 'imageString.png', <-- returned from utility function saveCanvas()
    //                       },
    // }
    // Then, gameToSave would be set inside localStorage as JSON.stringify({ nameOfGameToSave: gameToSave });
  };

  loadGame = () => {
    // 1. pull the loadedGame out of local storage using this.nameOfGame, then JSON.parse: const loadedGame = JSON.parse(localStorage.getItem(this.nameOfGame))
    // 2. update all necessary game state using all game details from the loadedGame.gameObj; then, set values from the gameObj for lines 33 - 46 inside Tetris constructor.  This will update the game state to match the saved game.
    // 3. Then, call a utility function that updates the canvas element with the passed in string returned from .toDataURL() when game was saved. drawLoadedGameToCanvasCtx(loadedGame.gameBoardString);
    // 4. That function inside utils would target the ctx by id, then create an img tag (no need to add this <img> to the DOM).  The src of the image tag would be set to the string passed into the function (which would be loadedGame.gameBoardString).
    // 5. That same function inside utils would then call ctx.drawImage(imgTagCreatedByutilityFunction)
    // 6. pause game so user can unpause when ready to continue their saved game.
  };

  startGame = () => {
    this.dequeuePiece();
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
      rotateSound.play();
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

  dequeuePiece = () => {
    if (!this.pieceQueue.length) {
      for (let i = 0; i < 2; i++) {
        this.addPieceToQueue();
      }
    } else {
      this.addPieceToQueue();
    }

    this.currentPiece = this.pieceQueue.shift();
    const nextPieceInQueue = this.pieceQueue[0];
    updateImageSrcById("preview-img", nextPieceInQueue.preview);

    this.currentPiecePlaced = false;
    this.numRotations = 0;
    this.currentPiece.drawShape();
    this.gravityDrop();
  };
}

export default Tetris;
