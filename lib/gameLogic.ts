export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];

export const BOARD_SIZE = 3;
export const CELL_COUNT = BOARD_SIZE ** 3;

const DIRECTIONS: [number, number, number][] = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 0],
  [1, -1, 0],
  [1, 0, 1],
  [1, 0, -1],
  [0, 1, 1],
  [0, 1, -1],
  [1, 1, 1],
  [1, 1, -1],
  [1, -1, 1],
  [1, -1, -1],
];

function inBounds(x: number, y: number, z: number) {
  return (
    x >= 0 &&
    x < BOARD_SIZE &&
    y >= 0 &&
    y < BOARD_SIZE &&
    z >= 0 &&
    z < BOARD_SIZE
  );
}

export function cellIndex(x: number, y: number, z: number) {
  return x + y * BOARD_SIZE + z * BOARD_SIZE * BOARD_SIZE;
}

export function cellCoords(index: number) {
  const x = index % BOARD_SIZE;
  const y = Math.floor(index / BOARD_SIZE) % BOARD_SIZE;
  const z = Math.floor(index / (BOARD_SIZE * BOARD_SIZE));
  return { x, y, z };
}

function buildWinLines() {
  const lines: number[][] = [];

  for (let z = 0; z < BOARD_SIZE; z++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        for (const [dx, dy, dz] of DIRECTIONS) {
          const cells: number[] = [];
          let inside = true;
          for (let step = 0; step < BOARD_SIZE; step++) {
            const nx = x + dx * step;
            const ny = y + dy * step;
            const nz = z + dz * step;
            if (!inBounds(nx, ny, nz)) {
              inside = false;
              break;
            }
            cells.push(cellIndex(nx, ny, nz));
          }
          if (inside) lines.push(cells);
        }
      }
    }
  }

  return lines;
}

const WIN_LINES = buildWinLines();

export function getWinningLine(board: Board): number[] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
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
    index < CELL_COUNT &&
    board[index] === null &&
    checkWinner(board) === null
  );
}

export function applyMove(board: Board, index: number, player: Player): Board {
  const next = [...board];
  next[index] = player;
  return next;
}

export function createEmptyBoard(): Board {
  return Array(CELL_COUNT).fill(null);
}

export function randomMove(board: Board): number {
  const empty = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((i): i is number => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}
