import type { Cell as CellValue } from "@/lib/gameLogic";

interface CellProps {
  value: CellValue;
  onClick: () => void;
  disabled: boolean;
}

export function Cell({ value, onClick, disabled }: CellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || value !== null}
      className="flex h-24 w-24 items-center justify-center rounded-card bg-cream text-4xl font-bold text-moss-900 shadow-card transition hover:bg-leaf/40 disabled:cursor-not-allowed"
      aria-label={value ? `Cell occupied by ${value}` : "Empty cell"}
    >
      {value}
    </button>
  );
}
