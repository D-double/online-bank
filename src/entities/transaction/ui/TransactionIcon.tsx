import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { findProvider, ProviderLogo } from '@/entities/provider';
import { cn } from '@/shared/lib/cn';
import type { Transaction } from '../types';

interface TransactionIconProps {
  transaction: Pick<Transaction, 'type' | 'providerId'>;
  className?: string;
}

export const TransactionIcon = ({ transaction, className }: TransactionIconProps) => {
  const provider = transaction.providerId ? findProvider(transaction.providerId) : undefined;
  if (provider) return <ProviderLogo provider={provider} className={className} />;

  const income = transaction.type === 'topup';
  const Icon = income ? ArrowDownLeft : ArrowUpRight;

  return (
    <span
      className={cn(
        'grid size-12 shrink-0 place-items-center rounded-2xl',
        income ? 'bg-positive/15 text-positive' : 'bg-violet-500/15 text-violet-500',
        className,
      )}
      aria-hidden
    >
      <Icon className="size-6" />
    </span>
  );
};
