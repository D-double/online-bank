import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon: Icon, title, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-3 py-10 text-center">
    <div className="grid size-16 place-items-center rounded-full bg-surface-strong text-subtle">
      <Icon className="size-8" />
    </div>
    <p className="text-muted">{title}</p>
    {action}
  </div>
);
