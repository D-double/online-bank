import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface DetailsItem {
  label: string;
  value: ReactNode;
  emphasized?: boolean;
}

export const DetailsList = ({ items, className }: { items: DetailsItem[]; className?: string }) => (
  <dl className={cn('flex flex-col divide-y divide-line', className)}>
    {items.map(({ label, value, emphasized }) => (
      <div key={label} className="flex items-center justify-between gap-4 py-3">
        <dt className="text-muted">{label}</dt>
        <dd className={cn('text-right', emphasized ? 'text-lg font-bold' : 'font-semibold')}>{value}</dd>
      </div>
    ))}
  </dl>
);
