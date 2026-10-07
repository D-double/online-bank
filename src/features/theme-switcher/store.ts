import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const THEME_MODES = ['light', 'dark', 'system'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

/** Ключ используется и inline-скриптом в index.html, чтобы применить тему до первой отрисовки. */
const STORAGE_KEY = 'bank-theme';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
    }),
    { name: STORAGE_KEY },
  ),
);
