import { GRID_SPACE } from "../../../utils/index.js";

class GameGrid {
  constructor(numRows, numCols, loadedGameGrid = null) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.grid = loadedGameGrid ? loadedGameGrid : new Array(this.numRows);
    if (!loadedGameGrid) {
      for (let i = 0; i < this.grid.length; i++) {
        const newRow = new Array(this.numCols + 1).fill(null);
        newRow[newRow.length - 1] = 0; // last index acts as the column count so we can know if a row has cleared
        this.grid[i] = newRow;
      }
    }
  }

  determineRowAndColumn = (block) => {
    const currentRow = Math.floor(block.yCoordinate / GRID_SPACE);
    const currentCol = Math.floor(block.xCoordinate / GRID_SPACE);
    return [currentRow, currentCol];
  };

  reachedTopOfGrid = (rowNum) => rowNum === 0;

  reachedBottomOfGrid = (rowNum) => rowNum >= this.numRows - 1;

  reachedLeftSideOfGrid = (colNum) => colNum <= 0;

  reachedRightSideOfGrid = (colNum) => colNum >= this.numCols - 1;
}

export default GameGrid;
