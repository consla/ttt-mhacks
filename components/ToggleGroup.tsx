interface ToggleGroupProps<T> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function ToggleGroup<T extends string | number>({
  options,
  value,
  onChange,
}: ToggleGroupProps<T>) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`rounded-full px-4 py-2 transition ${
            value === option.value
              ? "bg-cream text-moss-900"
              : "bg-moss-800 text-moss-300 hover:text-cream"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
