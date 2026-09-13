"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Cell } from "./Cell";
import {
  BOARD_SIZE,
  boardDimensions,
  cellCoords,
  type Board as BoardValue,
} from "@/lib/gameLogic";
import { cn } from "@/lib/utils";

interface BoardProps {
  board: BoardValue;
  onCellClick: (index: number) => void;
  disabled: boolean;
  winningLine: number[] | null;
}

// Tweak these to change how the cubes look.
const CELL_SIZE = 46; // edge length of each cube, in px
const STEP = 100; // distance between cube centers, in px
const STAGE_SIZE = 416; // width/height of one cube's card at full size, in px
const DEFAULT_VIEW = { yaw: 36, pitch: -24 };
const DRAG_SPEED = 0.45; // degrees per px dragged
const KEY_STEP = 10; // degrees per arrow key press

const CELLS_PER_CUBE = BOARD_SIZE ** 3;
const CENTER = (BOARD_SIZE - 1) / 2;
const OFFSETS = Array.from(
  { length: BOARD_SIZE },
  (_, i) => (i - CENTER) * STEP,
);

type View = typeof DEFAULT_VIEW;
type Rod = { width: number; height: number; transform: string };

// Thin rods through the cube centers, one per row/column/pillar. Each rod is
// two crossed planes so it stays visible when viewed edge-on.
function latticeRods(): Rod[] {
  const long = STEP * (BOARD_SIZE - 1);
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
  const dimensions = boardDimensions(board);
  // A 4D board is shown as three 3D cubes side by side: the 4th coordinate
  // picks the cube.
  const cubeCount = dimensions === 4 ? BOARD_SIZE : 1;
  const [view, setView] = useState(DEFAULT_VIEW);
  const [orbiting, setOrbiting] = useState(false);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const last = useRef({ x: 0, y: 0 });

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

  const handleCellClick = useCallback(
    (index: number) => {
      if (didDrag.current) return;
      onCellClick(index);
    },
    [onCellClick],
  );

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        role="group"
        aria-label={`${dimensions}D board. Drag or use arrow keys to orbit.`}
        tabIndex={0}
        className={cn(
          "flex w-full cursor-grab touch-none select-none items-center justify-center gap-4 rounded-card outline-none focus-visible:ring-2 focus-visible:ring-leaf active:cursor-grabbing",
          cubeCount > 1 ? "max-w-[60rem] flex-col md:flex-row" : "max-w-[26rem]",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        {Array.from({ length: cubeCount }, (_, cube) => (
          <div
            key={cube}
            className="flex w-full max-w-[26rem] flex-col items-center gap-2 md:flex-1"
          >
            <CubeStage view={view} orbiting={orbiting}>
              <CubeContents
                board={board}
                cube={cube}
                cubeCount={cubeCount}
                onCellClick={handleCellClick}
                disabled={disabled}
                winningLine={winningLine}
              />
            </CubeStage>
            {cubeCount > 1 && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-moss-300">
                Cube {cube + 1}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-moss-300">
        <span>Drag to orbit</span>
        {cubeCount > 1 && (
          <>
            <span aria-hidden>·</span>
            <span>Lines can run through all three cubes</span>
          </>
        )}
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

interface CubeStageProps {
  view: View;
  orbiting: boolean;
  children: ReactNode;
}

// One parchment card with a rotating 3D scene inside. The scene shrinks when
// the card is narrower than STAGE_SIZE.
function CubeStage({ view, orbiting, children }: CubeStageProps) {
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / STAGE_SIZE));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={stageRef} className="relative aspect-square w-full">
      <div className="pointer-events-none absolute inset-0 rounded-card bg-parchment shadow-card" />
      <div className="absolute inset-0 [perspective:900px]">
        <div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{
            transform: `translateZ(-40px) scale3d(${scale}, ${scale}, ${scale}) rotateX(${view.pitch}deg) rotateY(${view.yaw}deg)`,
            pointerEvents: orbiting ? "none" : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

interface CubeContentsProps {
  board: BoardValue;
  cube: number;
  cubeCount: number;
  onCellClick: (index: number) => void;
  disabled: boolean;
  winningLine: number[] | null;
}

// The rods and cells of one cube. Memoized so dragging (which only changes
// the scene's rotation) doesn't re-render every cell.
const CubeContents = memo(function CubeContents({
  board,
  cube,
  cubeCount,
  onCellClick,
  disabled,
  winningLine,
}: CubeContentsProps) {
  const firstIndex = cube * CELLS_PER_CUBE;

  return (
    <>
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
      {Array.from({ length: CELLS_PER_CUBE }, (_, offset) => {
        const index = firstIndex + offset;
        const [x, y, z] = cellCoords(offset, 3);
        const position = `layer ${z + 1}, row ${y + 1}, column ${x + 1}`;
        const label =
          cubeCount > 1
            ? `Cube ${cube + 1}, ${position}`
            : position[0].toUpperCase() + position.slice(1);
        return (
          <div
            key={index}
            className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
            style={{
              transform: `translate3d(${(x - CENTER) * STEP}px, ${(y - CENTER) * STEP}px, ${(z - CENTER) * STEP}px)`,
            }}
          >
            <Cell
              value={board[index]}
              onClick={() => onCellClick(index)}
              disabled={disabled}
              highlighted={winningLine?.includes(index) ?? false}
              size={CELL_SIZE}
              label={label}
            />
          </div>
        );
      })}
    </>
  );
});
