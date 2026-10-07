import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const SegmentedControl = <T extends string>({ options, value, onChange }: SegmentedControlProps<T>) => (
  <div
    className="grid gap-1 rounded-full bg-surface-strong p-1"
    style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    role="radiogroup"
  >
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        role="radio"
        aria-checked={option.value === value}
        onClick={() => onChange(option.value)}
        className={cn(
          'flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors',
          option.value === value ? 'bg-brand-gradient text-white shadow-md shadow-brand-500/25' : 'text-muted hover:text-fg',
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
);
