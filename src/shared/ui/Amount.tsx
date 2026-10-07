import { useTranslation } from 'react-i18next';
import { formatNumber } from '@/shared/lib/format';
import { cn } from '@/shared/lib/cn';

interface AmountProps {
  value: number;
  hidden?: boolean;
  sign?: '+' | '-';
  className?: string;
}

export const Amount = ({ value, hidden = false, sign, className }: AmountProps) => {
  const { t } = useTranslation();

  return (
    <span className={cn('whitespace-nowrap tabular-nums', className)}>
      {hidden ? '••••••' : `${sign ?? ''}${formatNumber(value)}`} {t('common.currency')}
    </span>
  );
};
