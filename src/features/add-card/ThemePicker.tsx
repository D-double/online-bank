import { Check } from 'lucide-react';
import { CARD_THEME_KEYS, CARD_THEMES, type CardTheme } from '@/entities/card';
import { cn } from '@/shared/lib/cn';

interface ThemePickerProps {
  value: CardTheme;
  onChange: (theme: CardTheme) => void;
}

export const ThemePicker = ({ value, onChange }: ThemePickerProps) => (
  <div className="flex flex-wrap gap-3" role="radiogroup">
    {CARD_THEME_KEYS.map((theme) => (
      <button
        key={theme}
        type="button"
        role="radio"
        aria-checked={theme === value}
        aria-label={theme}
        onClick={() => onChange(theme)}
        className={cn(
          'grid size-10 place-items-center rounded-full bg-gradient-to-br text-white ring-offset-2 ring-offset-surface transition-shadow',
          CARD_THEMES[theme],
          theme === value && 'ring-2 ring-brand-500',
        )}
      >
        {theme === value && <Check className="size-5" />}
      </button>
    ))}
  </div>
);
