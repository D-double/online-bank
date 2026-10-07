import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Amount } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { shortCardMask } from '@/shared/lib/cardUtils';
import { CARD_THEMES, type Card } from '../types';
import { CardBrandLogo } from './CardBrandLogo';

interface CardSelectProps {
  cards: Card[];
  value: string;
  onChange: (cardId: string) => void;
  error?: string;
}

export const CardSelect = ({ cards, value, onChange, error }: CardSelectProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-muted">{t('payment.fromCard')}</span>
      <div className="flex flex-col gap-2" role="radiogroup">
        {cards.map((card) => {
          const selected = card.id === value;
          return (
            <button
              key={card.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={card.isBlocked}
              onClick={() => onChange(card.id)}
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors',
                selected ? 'border-brand-500 bg-brand-500/10' : 'border-line bg-surface hover:bg-surface-muted',
                card.isBlocked && 'opacity-50',
              )}
            >
              <span
                className={cn(
                  'grid h-9 w-14 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white',
                  CARD_THEMES[card.theme],
                )}
              >
                <CardBrandLogo brand={card.brand} className="scale-50" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{shortCardMask(card.number)}</span>
                <span className="block text-sm text-muted">
                  {card.isBlocked ? t('cards.blocked') : <Amount value={card.balance} />}
                </span>
              </span>
              {selected && <Check className="size-5 text-brand-500" />}
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-negative">{error}</p>}
    </div>
  );
};
