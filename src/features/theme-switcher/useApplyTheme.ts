import { useEffect, useSyncExternalStore } from 'react';
import { useThemeStore } from './store';

const DARK_QUERY = '(prefers-color-scheme: dark)';

const subscribeToSystemTheme = (onChange: () => void) => {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

const getSystemPrefersDark = () => window.matchMedia(DARK_QUERY).matches;

/** Итоговая тема с учётом режима «как в системе». */
export const useIsDarkTheme = (): boolean => {
  const mode = useThemeStore((state) => state.mode);
  const systemPrefersDark = useSyncExternalStore(subscribeToSystemTheme, getSystemPrefersDark);
  return mode === 'dark' || (mode === 'system' && systemPrefersDark);
};

export const useApplyTheme = () => {
  const isDark = useIsDarkTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);
};
