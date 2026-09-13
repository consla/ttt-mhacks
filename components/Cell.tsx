"use client";

import type { Cell as CellValue } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";

interface CellProps {
  value: CellValue;
  onClick: () => void;
  disabled: boolean;
  highlighted: boolean;
  size: number;
  label: string;
}

// One transform per cube face: front, back, right, left, top, bottom.
const FACES = [
  "rotateY(0deg)",
  "rotateY(180deg)",
  "rotateY(90deg)",
  "rotateY(-90deg)",
  "rotateX(90deg)",
  "rotateX(-90deg)",
];

export function Cell({
  value,
  onClick,
  disabled,
  highlighted,
  size,
  label,
}: CellProps) {
  const half = size / 2;
  const occupied = value !== null;
  const clickable = !disabled && !occupied;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || occupied}
      draggable={false}
      className={cn(
        "group absolute outline-none [transform-style:preserve-3d]",
        clickable ? "cursor-pointer" : "cursor-not-allowed",
      )}
      style={{
        width: size,
        height: size,
        marginLeft: -half,
        marginTop: -half,
      }}
      aria-label={value ? `${label}, occupied by ${value}` : `${label}, empty`}
    >
      {FACES.map((rotation) => (
        <span
          key={rotation}
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-md border font-bold text-moss-900 transition-colors [backface-visibility:hidden] group-focus-visible:border-2 group-focus-visible:border-moss-900",
            highlighted
              ? "border-moss-700 bg-leaf"
              : occupied
                ? "border-moss-500/45 bg-cream"
                : "border-moss-500/40 bg-cream/65",
            clickable && "group-hover:bg-leaf/70",
          )}
          style={{
            transform: `${rotation} translateZ(${half}px)`,
            fontSize: size * 0.55,
          }}
        >
          {value}
        </span>
      ))}
    </button>
  );
}
