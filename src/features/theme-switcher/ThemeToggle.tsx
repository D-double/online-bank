import { useTranslation } from 'react-i18next';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useThemeStore } from './store';
import { useIsDarkTheme } from './useApplyTheme';

/** Быстрое переключение светлая/тёмная; полный выбор режима — в профиле. */
export const ThemeToggle = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const isDark = useIsDarkTheme();
  const setMode = useThemeStore((state) => state.setMode);
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      onClick={() => setMode(isDark ? 'light' : 'dark')}
      className={cn('grid size-10 place-items-center rounded-full transition-colors', className)}
      aria-label={t(isDark ? 'theme.light' : 'theme.dark')}
    >
      <Icon className="size-5" />
    </button>
  );
};
