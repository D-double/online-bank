import type { CardBrand } from '@/shared/lib/cardUtils';

export type { CardBrand };

export const CARD_THEMES = {
  emerald: 'from-teal-400 via-cyan-500 to-blue-600',
  violet: 'from-indigo-500 via-violet-500 to-fuchsia-500',
  midnight: 'from-slate-700 via-indigo-950 to-slate-950',
  sunset: 'from-orange-400 via-pink-500 to-fuchsia-600',
  ocean: 'from-sky-400 via-blue-500 to-violet-600',
  gold: 'from-amber-300 via-orange-400 to-pink-500',
} as const;

export type CardTheme = keyof typeof CARD_THEMES;

export const CARD_THEME_KEYS = Object.keys(CARD_THEMES) as CardTheme[];

export interface Card {
  id: string;
  number: string;
  holder: string;
  expiry: string;
  brand: CardBrand;
  balance: number;
  theme: CardTheme;
  isMain: boolean;
  isBlocked: boolean;
}

export type NewCard = Omit<Card, 'id' | 'isMain' | 'isBlocked'>;
