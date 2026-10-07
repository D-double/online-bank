import { maskCardNumber } from '@/shared/lib/cardUtils';
import { daysAgo, isSameDay, startOfDay } from '@/shared/lib/date';
import { formatPhone } from '@/shared/lib/format';
import { isIncome, type Transaction, type TransactionType } from './types';

const CARD_DETAIL_KEYS = new Set(['recipientCard', 'senderCard']);

export const formatDetailValue = (key: string, value: string): string => {
  if (key === 'phone') return formatPhone(value);
  if (CARD_DETAIL_KEYS.has(key)) return maskCardNumber(value);
  return value;
};

export const PERIODS = ['all', 'today', 'week', 'month'] as const;
export type Period = (typeof PERIODS)[number];

const PERIOD_DAYS: Record<Exclude<Period, 'all'>, number> = { today: 0, week: 6, month: 29 };

export interface TransactionFilter {
  type: TransactionType | 'all';
  period: Period;
}

export const filterTransactions = (transactions: Transaction[], { type, period }: TransactionFilter): Transaction[] => {
  const from = period === 'all' ? null : daysAgo(PERIOD_DAYS[period]);
  return transactions.filter(
    (transaction) =>
      (type === 'all' || transaction.type === type) && (!from || new Date(transaction.createdAt) >= from),
  );
};

export const groupByDay = (transactions: Transaction[]): [string, Transaction[]][] => {
  const groups = new Map<string, Transaction[]>();
  for (const transaction of transactions) {
    const dayKey = startOfDay(new Date(transaction.createdAt)).toISOString();
    groups.set(dayKey, [...(groups.get(dayKey) ?? []), transaction]);
  }
  return [...groups.entries()];
};

const isSuccessful = (transaction: Transaction): boolean => transaction.status === 'success';

export interface Totals {
  income: number;
  expense: number;
}

export const summarize = (transactions: Transaction[]): Totals =>
  transactions.filter(isSuccessful).reduce(
    (totals, transaction) =>
      isIncome(transaction)
        ? { ...totals, income: totals.income + transaction.amount }
        : { ...totals, expense: totals.expense + transaction.amount + transaction.fee },
    { income: 0, expense: 0 },
  );

/** Доля поступлений, ушедшая на расходы (0…1); без поступлений любой расход считается полной тратой. */
export const getSpentShare = ({ income, expense }: Totals): number => {
  if (income > 0) return Math.min(expense / income, 1);
  return expense > 0 ? 1 : 0;
};

/** Поступления и расходы по дням за последние `days` дней, от старых к новым. */
export const getDailyTotals = (transactions: Transaction[], days: number): (Totals & { date: Date })[] =>
  Array.from({ length: days }, (_, index) => {
    const date = daysAgo(days - 1 - index);
    const dayTransactions = transactions.filter((transaction) => isSameDay(new Date(transaction.createdAt), date));
    return { date, ...summarize(dayTransactions) };
  });

const balanceChange = (transaction: Transaction): number =>
  isIncome(transaction) ? transaction.amount : -(transaction.amount + transaction.fee);

/** Баланс на конец каждого из последних `days` дней, восстановленный от текущего баланса назад по операциям. */
export const getBalanceHistory = (transactions: Transaction[], currentBalance: number, days: number): number[] => {
  const successful = transactions.filter(isSuccessful);
  return Array.from({ length: days }, (_, index) => {
    const dayEnd = daysAgo(days - 2 - index);
    const changesAfter = successful
      .filter((transaction) => new Date(transaction.createdAt) >= dayEnd)
      .reduce((sum, transaction) => sum + balanceChange(transaction), 0);
    return currentBalance - changesAfter;
  });
};
