import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useBalanceVisibility } from './store';

export const BalanceToggle = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const { hidden, toggle } = useBalanceVisibility();
  const Icon = hidden ? EyeOff : Eye;

  return (
    <button
      onClick={toggle}
      className={cn('grid size-9 place-items-center rounded-full transition-colors', className)}
      aria-label={t(hidden ? 'home.showBalance' : 'home.hideBalance')}
    >
      <Icon className="size-5" />
    </button>
  );
};
