import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface SectionProps {
  title?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export const Section = ({ title, action, className, children }: SectionProps) => (
  <section className={cn('rounded-3xl bg-surface p-4 shadow-sm shadow-brand-500/5 dark:ring-1 dark:ring-white/5', className)}>
    {(title || action) && (
      <div className="mb-3 flex items-center justify-between">
        {title && <h2 className="text-lg font-bold">{title}</h2>}
        {action}
      </div>
    )}
    {children}
  </section>
);
