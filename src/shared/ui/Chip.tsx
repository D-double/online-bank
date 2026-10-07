import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface ChipProps {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}

export const Chip = ({ active = false, onClick, children }: ChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
      active
        ? 'bg-brand-gradient text-white shadow-md shadow-brand-500/25'
        : 'bg-surface text-fg-soft ring-1 ring-line ring-inset hover:bg-surface-muted',
    )}
  >
    {children}
  </button>
);
