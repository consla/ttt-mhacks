"use client";

import { Cell } from "./Cell";
import type { Board as BoardValue } from "@/lib/gameLogic";

interface BoardProps {
  board: BoardValue;
  onCellClick: (index: number) => void;
  disabled: boolean;
}

export function Board({ board, onCellClick, disabled }: BoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3 rounded-card bg-parchment p-4 shadow-card">
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => onCellClick(index)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
