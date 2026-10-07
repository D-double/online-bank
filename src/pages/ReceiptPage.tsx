import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircleCheck, CircleX } from 'lucide-react';
import { formatDetailValue, isIncome, TransactionIcon, useTransactionsStore } from '@/entities/transaction';
import { shortCardMask } from '@/shared/lib/cardUtils';
import { cn } from '@/shared/lib/cn';
import { useDateFormatter } from '@/shared/i18n/useDateFormatter';
import { Amount, ButtonLink, DetailsList, PageHeader, Section, type DetailsItem } from '@/shared/ui';

interface ReceiptLocationState {
  justCompleted?: boolean;
}

export const ReceiptPage = () => {
  const { t } = useTranslation();
  const { formatDateTime } = useDateFormatter();
  const { transactionId } = useParams();
  const { state } = useLocation() as { state: ReceiptLocationState | null };
  const transaction = useTransactionsStore((store) => store.transactions.find((item) => item.id === transactionId));

  if (!transaction) return <Navigate to="/history" replace />;

  const success = transaction.status === 'success';
  const income = isIncome(transaction);
  const StatusIcon = success ? CircleCheck : CircleX;

  const items: DetailsItem[] = [
    { label: t('receipt.date'), value: formatDateTime(transaction.createdAt) },
    { label: t(income ? 'receipt.toCard' : 'payment.fromCard'), value: shortCardMask(transaction.cardNumber) },
    ...Object.entries(transaction.details).map(([key, value]) => ({
      label: t(`fields.${key}`),
      value: formatDetailValue(key, value),
    })),
    { label: t('payment.amount'), value: <Amount value={transaction.amount} /> },
    { label: t('payment.fee'), value: <Amount value={transaction.fee} /> },
    { label: t('payment.total'), value: <Amount value={transaction.amount + transaction.fee} />, emphasized: true },
    { label: t('receipt.id'), value: transaction.id.slice(0, 8).toUpperCase() },
  ];

  return (
    <>
      <PageHeader back={!state?.justCompleted} title={t('receipt.title')} />

      <Section className="mb-4">
        <div className="flex flex-col items-center gap-3 pt-2 pb-4 text-center">
          {state?.justCompleted ? (
            <StatusIcon
              className={cn('size-20 animate-pop', success ? 'text-positive' : 'text-negative')}
              strokeWidth={1.5}
            />
          ) : (
            <TransactionIcon transaction={transaction} className="size-16" />
          )}
          <div>
            <p className="text-lg font-bold">{transaction.title}</p>
            <p className="text-sm text-muted">{t(`transactions.types.${transaction.type}`)}</p>
          </div>
          <Amount
            value={transaction.amount}
            sign={income ? '+' : '-'}
            className={cn('text-3xl font-extrabold', income && 'text-positive')}
          />
          <span
            className={cn(
              'rounded-full px-3 py-1 text-sm font-semibold',
              success ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative',
            )}
          >
            {t(`transactions.status.${transaction.status}`)}
          </span>
          {transaction.failureReason && (
            <p className="text-sm text-negative">{t(`errors.${transaction.failureReason}`)}</p>
          )}
        </div>
        <DetailsList items={items} />
      </Section>

      <div className="flex flex-col gap-3">
        {transaction.providerId && (
          <ButtonLink to={`/payments/${transaction.providerId}`} variant="outline" fullWidth>
            {t('receipt.repeat')}
          </ButtonLink>
        )}
        <ButtonLink to="/" fullWidth>
          {t('receipt.toHome')}
        </ButtonLink>
      </div>
    </>
  );
};
