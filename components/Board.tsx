"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Cell } from "./Cell";
import {
  BOARD_SIZE,
  cellCoords,
  type Board as BoardValue,
} from "@/lib/gameLogic";

interface BoardProps {
  board: BoardValue;
  onCellClick: (index: number) => void;
  disabled: boolean;
  winningLine: number[] | null;
}

// Tweak these to change how the cube looks.
const CELL_SIZE = 46; // edge length of each cube, in px
const STEP = 100; // distance between cube centers, in px
const STAGE_SIZE = 416; // width/height of the board card at full size, in px
const DEFAULT_VIEW = { yaw: 36, pitch: -24 };
const DRAG_SPEED = 0.45; // degrees per px dragged
const KEY_STEP = 10; // degrees per arrow key press

const OFFSETS = [-STEP, 0, STEP];

type Rod = { width: number; height: number; transform: string };

// Thin rods through the cube centers, one per row/column/pillar. Each rod is
// two crossed planes so it stays visible when viewed edge-on.
function latticeRods(): Rod[] {
  const long = STEP * 2;
  const rods: Rod[] = [];
  for (const a of OFFSETS) {
    for (const b of OFFSETS) {
      // Along x
      rods.push(
        { width: long, height: 2, transform: `translate3d(0px, ${a}px, ${b}px)` },
        {
          width: long,
          height: 2,
          transform: `translate3d(0px, ${a}px, ${b}px) rotateX(90deg)`,
        },
      );
      // Along y
      rods.push(
        { width: 2, height: long, transform: `translate3d(${a}px, 0px, ${b}px)` },
        {
          width: 2,
          height: long,
          transform: `translate3d(${a}px, 0px, ${b}px) rotateY(90deg)`,
        },
      );
      // Along z
      rods.push(
        {
          width: long,
          height: 2,
          transform: `translate3d(${a}px, ${b}px, 0px) rotateY(90deg)`,
        },
        {
          width: long,
          height: 2,
          transform: `translate3d(${a}px, ${b}px, 0px) rotateY(90deg) rotateX(90deg)`,
        },
      );
    }
  }
  return rods;
}

const RODS = latticeRods();

function clampPitch(pitch: number) {
  return Math.max(-85, Math.min(85, pitch));
}

export function Board({
  board,
  onCellClick,
  disabled,
  winningLine,
}: BoardProps) {
  const [view, setView] = useState(DEFAULT_VIEW);
  const [orbiting, setOrbiting] = useState(false);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  // Shrink the whole scene on screens narrower than the card.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / STAGE_SIZE));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  function rotate(dYaw: number, dPitch: number) {
    setView(({ yaw, pitch }) => ({
      yaw: yaw + dYaw,
      pitch: clampPitch(pitch + dPitch),
    }));
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    dragging.current = true;
    didDrag.current = false;
    last.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const dx = event.clientX - last.current.x;
    const dy = event.clientY - last.current.y;
    // Small movements still count as a click on a cell.
    if (!didDrag.current) {
      if (Math.abs(dx) + Math.abs(dy) <= 4) return;
      didDrag.current = true;
      setOrbiting(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    last.current = { x: event.clientX, y: event.clientY };
    rotate(dx * DRAG_SPEED, -dy * DRAG_SPEED);
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    setOrbiting(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    // Let the click that follows this pointerup see didDrag, then clear it so
    // keyboard presses on a cell still work.
    window.setTimeout(() => {
      didDrag.current = false;
    }, 0);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_STEP, 0],
      ArrowRight: [KEY_STEP, 0],
      ArrowUp: [0, KEY_STEP],
      ArrowDown: [0, -KEY_STEP],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    rotate(...move);
  }

  function handleCellClick(index: number) {
    if (didDrag.current) return;
    onCellClick(index);
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        ref={stageRef}
        className="relative aspect-square w-full max-w-[26rem]"
      >
        <div className="pointer-events-none absolute inset-0 rounded-card bg-parchment shadow-card" />
        <div
          role="group"
          aria-label="3D board. Drag or use arrow keys to orbit."
          tabIndex={0}
          className="absolute inset-0 cursor-grab touch-none select-none rounded-card outline-none [perspective:900px] focus-visible:ring-2 focus-visible:ring-leaf active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
        >
          <div
            className="absolute inset-0 [transform-style:preserve-3d]"
            style={{
              transform: `translateZ(-40px) scale3d(${scale}, ${scale}, ${scale}) rotateX(${view.pitch}deg) rotateY(${view.yaw}deg)`,
            }}
          >
            {RODS.map((rod, index) => (
              <div
                key={index}
                className="pointer-events-none absolute left-1/2 top-1/2 bg-moss-500/35"
                style={{
                  width: rod.width,
                  height: rod.height,
                  marginLeft: -rod.width / 2,
                  marginTop: -rod.height / 2,
                  transform: rod.transform,
                }}
              />
            ))}
            {board.map((value, index) => {
              const { x, y, z } = cellCoords(index);
              const center = (BOARD_SIZE - 1) / 2;
              return (
                <div
                  key={index}
                  className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
                  style={{
                    transform: `translate3d(${(x - center) * STEP}px, ${(y - center) * STEP}px, ${(z - center) * STEP}px)`,
                    pointerEvents: orbiting ? "none" : "auto",
                  }}
                >
                  <Cell
                    value={value}
                    onClick={() => handleCellClick(index)}
                    disabled={disabled}
                    highlighted={winningLine?.includes(index) ?? false}
                    size={CELL_SIZE}
                    label={`Layer ${z + 1}, row ${y + 1}, column ${x + 1}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-moss-300">
        <span>Drag to orbit</span>
        <span aria-hidden>·</span>
        <button
          type="button"
          onClick={() => setView(DEFAULT_VIEW)}
          className="uppercase transition hover:text-cream"
        >
          Reset view
        </button>
      </div>
    </div>
  );
}
