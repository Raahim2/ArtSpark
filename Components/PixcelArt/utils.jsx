// ../Components/PixcelArt/utils.js

export const GRID_SIZE = 32;

/**
 * Creates a new, empty grid.
 * @returns {Array<Array<null>>} A 2D array filled with null.
 */
export const createEmptyGrid = () => Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));

/**
 * Calculates all points on a line between two coordinates using Bresenham's line algorithm.
 * @returns {Array<{x: number, y: number}>} An array of points.
 */
export const bresenhamLine = (x0, y0, x1, y1) => {
  const points = [];
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;

  while (true) {
    points.push({ x: x0, y: y0 });
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      if (x0 === x1) break;
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      if (y0 === y1) break;
      err += dx;
      y0 += sy;
    }
  }
  return points;
};

/**
 * Fills a contiguous area of a grid with a new color.
 * @returns {Array<Array<string|null>>} The new grid state.
 */
export const floodFill = (grid, startRow, startCol, newColor) => {
  const targetColor = grid[startRow][startCol];
  if (targetColor === newColor) return grid;
  const newGrid = grid.map(r => [...r]);
  const queue = [[startRow, startCol]];
  while (queue.length > 0) {
    const [row, col] = queue.shift();
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) continue;
    if (newGrid[row][col] !== targetColor) continue;
    newGrid[row][col] = newColor;
    queue.push([row + 1, col]);
    queue.push([row - 1, col]);
    queue.push([row, col + 1]);
    queue.push([row, col - 1]);
  }
  return newGrid;
};