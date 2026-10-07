import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Amount } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { formatTime } from '@/shared/lib/date';
import { isIncome, type Transaction } from '../types';
import { TransactionIcon } from './TransactionIcon';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const { t } = useTranslation();
  const failed = transaction.status === 'failed';
  const income = isIncome(transaction);

  return (
    <Link
      to={`/history/${transaction.id}`}
      className="-mx-2 flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-surface-muted"
    >
      <TransactionIcon transaction={transaction} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{transaction.title}</p>
        <p className="truncate text-sm text-muted">
          {t(`transactions.types.${transaction.type}`)} · {formatTime(transaction.createdAt)}
        </p>
      </div>
      <div className="text-right">
        <Amount
          value={transaction.amount}
          sign={income ? '+' : '-'}
          className={cn('font-bold', failed ? 'text-subtle line-through' : income && 'text-positive')}
        />
        {failed && <p className="text-xs font-medium text-negative">{t('transactions.status.failed')}</p>}
      </div>
    </Link>
  );
};
