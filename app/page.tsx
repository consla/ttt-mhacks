"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Header } from "@/components/Header";
import { Board } from "@/components/Board";
import { ToggleGroup } from "@/components/ToggleGroup";
import {
  createEmptyBoard,
  applyMove,
  checkWinner,
  getWinningLine,
  isDraw,
  isValidMove,
  randomMove,
  type Board as BoardValue,
  type Dimensions,
  type Player,
} from "@/lib/gameLogic";

const HUMAN: Player = "X";
const OPPONENT: Player = "O";

type Mode = "twoPlayer" | "vsComputer";

const MODES: { value: Mode; label: string }[] = [
  { value: "twoPlayer", label: "2 Player" },
  { value: "vsComputer", label: "vs Computer" },
];

const DIMENSIONS: { value: Dimensions; label: string }[] = [
  { value: 3, label: "3D" },
  { value: 4, label: "4D" },
];

export default function Home() {
  const [mode, setMode] = useState<Mode>("twoPlayer");
  const [dimensions, setDimensions] = useState<Dimensions>(3);
  const [board, setBoard] = useState<BoardValue>(() =>
    createEmptyBoard(dimensions),
  );
  const [current, setCurrent] = useState<Player>(HUMAN);

  const winningLine = getWinningLine(board);
  const winner = winningLine ? board[winningLine[0]] : null;
  const draw = isDraw(board);
  const gameOver = winner !== null || draw;
  const computersTurn = mode === "vsComputer" && current === OPPONENT;

  function handleCellClick(index: number) {
    if (gameOver || computersTurn || !isValidMove(board, index)) return;

    const nextBoard = applyMove(board, index, current);
    setBoard(nextBoard);
    // TODO: sound — playSound("move") here. See the "Sound effects"
    // workshop breakout in /tutorial.

    const nextWinner = checkWinner(nextBoard);
    if (nextWinner) {
      // TODO: sound — playSound("win") here.
      return;
    }
    if (isDraw(nextBoard)) {
      // TODO: sound — playSound("draw") here.
      return;
    }
    setCurrent(current === HUMAN ? OPPONENT : HUMAN);
  }

  function startGame(nextDimensions: Dimensions) {
    setBoard(createEmptyBoard(nextDimensions));
    setCurrent(HUMAN);
  }

  function handleReset() {
    startGame(dimensions);
  }

  function handleModeChange(nextMode: Mode) {
    setMode(nextMode);
    startGame(dimensions);
  }

  function handleDimensionsChange(nextDimensions: Dimensions) {
    setDimensions(nextDimensions);
    startGame(nextDimensions);
  }

  useEffect(() => {
    if (!computersTurn || gameOver) return;

    const timeout = setTimeout(() => {
      const index = randomMove(board);
      const nextBoard = applyMove(board, index, OPPONENT);
      setBoard(nextBoard);
      // TODO: sound — playSound("move") here. See the "Sound effects"
      // workshop breakout in /tutorial.

      const nextWinner = checkWinner(nextBoard);
      if (nextWinner) {
        // TODO: sound — playSound("win") here.
        return;
      }
      if (isDraw(nextBoard)) {
        // TODO: sound — playSound("draw") here.
        return;
      }
      setCurrent(HUMAN);
    }, 400);

    return () => clearTimeout(timeout);
  }, [computersTurn, gameOver, board]);

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center px-4">
      <Navbar />
      <Header dimensions={dimensions} />

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pb-6 font-mono text-xs uppercase tracking-widest">
        <ToggleGroup
          options={DIMENSIONS}
          value={dimensions}
          onChange={handleDimensionsChange}
        />
        <ToggleGroup
          options={MODES}
          value={mode}
          onChange={handleModeChange}
        />
      </div>

      <Board
        board={board}
        onCellClick={handleCellClick}
        disabled={gameOver || computersTurn}
        winningLine={winningLine}
      />
      <div className="pt-6 font-mono text-sm text-moss-300">
        {winner && `${winner} wins!`}
        {draw && "It's a tie!"}
        {!gameOver && computersTurn && "Computer's turn…"}
        {!gameOver && !computersTurn && `${current}'s turn`}
      </div>
      <button
        type="button"
        onClick={handleReset}
        className="mt-4 rounded-full bg-cream px-6 py-2 font-mono text-xs uppercase tracking-widest text-moss-900 transition hover:bg-leaf"
      >
        New game
      </button>
    </main>
  );
}
