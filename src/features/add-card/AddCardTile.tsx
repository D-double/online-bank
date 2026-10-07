import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { ADD_CARD_PATH } from './constants';

/** Плитка в размер банковской карты, открывающая добавление новой карты. */
export const AddCardTile = ({ className }: { className?: string }) => {
  const { t } = useTranslation();

  return (
    <Link
      to={ADD_CARD_PATH}
      className={cn(
        'flex aspect-[1.6] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-line text-muted transition-colors hover:border-brand-500 hover:text-brand-500',
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-brand-gradient text-white shadow-lg shadow-brand-500/30">
        <Plus className="size-6" />
      </span>
      <span className="font-semibold">{t('cards.add')}</span>
    </Link>
  );
};
