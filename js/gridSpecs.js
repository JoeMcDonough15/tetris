// export const NUM_ROWS = 40;
export const NUM_ROWS = 30;
// export const NUM_COLS = 30;
export const NUM_COLS = 20;
export const GRID_SPACE = 20;

export const determineRowAndColumn = (block) => {
  const currentRow = block.yCoordinate / GRID_SPACE;
  const currentCol = block.xCoordinate / GRID_SPACE;
  return [currentRow, currentCol];
};

export const reachedBottomOfGrid = (rowNum) => rowNum >= NUM_ROWS - 1;

export const reachedLeftSideOfGrid = (colNum) => colNum <= 0;

export const reachedRightSideOfGrid = (colNum) => colNum >= NUM_COLS - 1;
