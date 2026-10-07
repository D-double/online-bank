import { useTranslation } from 'react-i18next';
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { SegmentedControl } from '@/shared/ui';
import { THEME_MODES, useThemeStore, type ThemeMode } from './store';

const ICONS: Record<ThemeMode, LucideIcon> = { light: Sun, dark: Moon, system: Monitor };

export const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { mode, setMode } = useThemeStore();

  const options = THEME_MODES.map((value) => {
    const Icon = ICONS[value];
    return {
      value,
      label: (
        <>
          <Icon className="size-4" /> {t(`theme.${value}`)}
        </>
      ),
    };
  });

  return <SegmentedControl options={options} value={mode} onChange={setMode} />;
};
