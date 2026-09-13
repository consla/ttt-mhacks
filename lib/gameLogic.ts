export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(board: Board): Player | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && checkWinner(board) === null;
}

export function isValidMove(board: Board, index: number): boolean {
  return (
    index >= 0 &&
    index < 9 &&
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
  return Array(9).fill(null);
}

export function randomMove(board: Board): number {
  const empty = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((i): i is number => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}
