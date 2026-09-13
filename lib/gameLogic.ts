export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];

export type Dimensions = 3 | 4;

export const BOARD_SIZE = 3;

export function cellCount(dimensions: Dimensions) {
  return BOARD_SIZE ** dimensions;
}

export function boardDimensions(board: Board): Dimensions {
  return board.length === cellCount(4) ? 4 : 3;
}

// Coordinates are [x, y, z] in 3D and [x, y, z, w] in 4D, each 0..BOARD_SIZE-1.
export function cellIndex(coords: number[]) {
  return coords.reduce(
    (index, value, axis) => index + value * BOARD_SIZE ** axis,
    0,
  );
}

export function cellCoords(index: number, dimensions: Dimensions) {
  return Array.from(
    { length: dimensions },
    (_, axis) => Math.floor(index / BOARD_SIZE ** axis) % BOARD_SIZE,
  );
}

// Every direction a line can point: each axis steps -1, 0 or +1. Only keep
// directions whose first non-zero step is +1 so each line is found once.
function lineDirections(dimensions: Dimensions) {
  const directions: number[][] = [];
  for (let i = 0; i < 3 ** dimensions; i++) {
    const direction = Array.from(
      { length: dimensions },
      (_, axis) => (Math.floor(i / 3 ** axis) % 3) - 1,
    );
    if (direction.find((step) => step !== 0) === 1) directions.push(direction);
  }
  return directions;
}

function buildWinLines(dimensions: Dimensions) {
  const lines: number[][] = [];
  const directions = lineDirections(dimensions);

  for (let start = 0; start < cellCount(dimensions); start++) {
    const origin = cellCoords(start, dimensions);
    for (const direction of directions) {
      const cells: number[] = [];
      for (let step = 0; step < BOARD_SIZE; step++) {
        const coords = origin.map((value, axis) => value + direction[axis] * step);
        if (coords.some((value) => value < 0 || value >= BOARD_SIZE)) break;
        cells.push(cellIndex(coords));
      }
      if (cells.length === BOARD_SIZE) lines.push(cells);
    }
  }

  return lines;
}

const WIN_LINES: Record<Dimensions, number[][]> = {
  3: buildWinLines(3),
  4: buildWinLines(4),
};

export function getWinningLine(board: Board): number[] | null {
  for (const line of WIN_LINES[boardDimensions(board)]) {
    const first = board[line[0]];
    if (first && line.every((index) => board[index] === first)) {
      return line;
    }
  }
  return null;
}

export function checkWinner(board: Board): Player | null {
  const line = getWinningLine(board);
  return line ? board[line[0]] : null;
}

export function isDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && checkWinner(board) === null;
}

export function isValidMove(board: Board, index: number): boolean {
  return (
    index >= 0 &&
    index < board.length &&
    board[index] === null &&
    checkWinner(board) === null
  );
}

export function applyMove(board: Board, index: number, player: Player): Board {
  const next = [...board];
  next[index] = player;
  return next;
}

export function createEmptyBoard(dimensions: Dimensions = 3): Board {
  return Array(cellCount(dimensions)).fill(null);
}

export function randomMove(board: Board): number {
  const empty = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((i): i is number => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}
