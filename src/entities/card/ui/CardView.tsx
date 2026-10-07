import { useTranslation } from 'react-i18next';
import { Lock, Star } from 'lucide-react';
import { Amount } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { formatCardNumberInput, maskCardNumber } from '@/shared/lib/cardUtils';
import { CARD_THEMES, type Card, type CardBrand } from '../types';
import { CardBrandLogo } from './CardBrandLogo';

export type CardViewData = Pick<Card, 'number' | 'holder' | 'expiry' | 'balance' | 'theme'> &
  Partial<Pick<Card, 'isMain' | 'isBlocked'>> & { brand: CardBrand | null };

interface CardViewProps {
  card: CardViewData;
  hideBalance?: boolean;
  /** Показывать номер полностью — для превью при вводе новой карты. */
  revealNumber?: boolean;
  className?: string;
}

const NUMBER_PLACEHOLDER = '0000 0000 0000 0000';

export const CardView = ({ card, hideBalance = false, revealNumber = false, className }: CardViewProps) => {
  const { t } = useTranslation();
  const number = revealNumber ? formatCardNumberInput(card.number) || NUMBER_PLACEHOLDER : maskCardNumber(card.number);

  return (
    <div
      className={cn(
        'relative flex aspect-[1.6] w-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white shadow-xl shadow-brand-500/20',
        CARD_THEMES[card.theme],
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs text-white/70">
            {t('cards.balance')}
            {card.isMain && (
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                <Star className="size-3 fill-current" /> {t('cards.main')}
              </span>
            )}
          </p>
          <Amount value={card.balance} hidden={hideBalance} className="text-2xl font-bold" />
        </div>
        {card.brand && <CardBrandLogo brand={card.brand} />}
      </div>

      <div className="relative">
        <p className="mb-2 font-mono text-lg tracking-widest">{number}</p>
        <div className="flex items-center justify-between text-xs text-white/80">
          <span className="truncate uppercase">{card.holder}</span>
          <span>{card.expiry || 'MM/YY'}</span>
        </div>
      </div>

      {card.isBlocked && (
        <div className="absolute inset-0 grid place-items-center bg-slate-900/60 backdrop-blur-[2px]">
          <span className="flex items-center gap-2 font-semibold">
            <Lock className="size-5" /> {t('cards.blocked')}
          </span>
        </div>
      )}
    </div>
  );
};
