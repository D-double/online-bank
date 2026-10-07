import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReceiptText } from 'lucide-react';
import {
  filterTransactions,
  getDailyTotals,
  getSpentShare,
  groupByDay,
  PERIODS,
  summarize,
  TransactionItem,
  useTransactionsStore,
  type TransactionFilter,
} from '@/entities/transaction';
import { useDateFormatter } from '@/shared/i18n/useDateFormatter';
import { daysAgo, isSameDay } from '@/shared/lib/date';
import { Amount, BarChart, Chip, EmptyState, PageHeader, ProgressRing, Section, type BarChartItem } from '@/shared/ui';

const TYPE_FILTERS: TransactionFilter['type'][] = ['all', 'payment', 'transfer', 'topup'];
const WEEK_DAYS = 7;

const WeekChart = () => {
  const { t } = useTranslation();
  const transactions = useTransactionsStore((state) => state.transactions);
  const items = useMemo<BarChartItem[]>(
    () =>
      getDailyTotals(transactions, WEEK_DAYS).map(({ date, income, expense }) => ({
        label: String(date.getDate()),
        values: [income, expense],
      })),
    [transactions],
  );

  return (
    <Section title={t('history.weekChart')} className="mb-4">
      <BarChart
        series={[
          { label: t('history.income'), className: 'bg-highlight' },
          { label: t('history.expense'), className: 'bg-accent' },
        ]}
        items={items}
      />
    </Section>
  );
};

export const HistoryPage = () => {
  const { t } = useTranslation();
  const { formatDate } = useDateFormatter();
  const transactions = useTransactionsStore((state) => state.transactions);
  const [filter, setFilter] = useState<TransactionFilter>({ type: 'all', period: 'all' });

  const filtered = useMemo(() => filterTransactions(transactions, filter), [transactions, filter]);
  const groups = useMemo(() => groupByDay(filtered), [filtered]);
  const totals = useMemo(() => summarize(filtered), [filtered]);
  const spentShare = getSpentShare(totals);

  const formatDayLabel = (dayKey: string): string => {
    const day = new Date(dayKey);
    if (isSameDay(day, new Date())) return t('history.today');
    if (isSameDay(day, daysAgo(1))) return t('history.yesterday');
    return formatDate(dayKey);
  };

  return (
    <>
      <PageHeader title={t('history.title')} />
      <WeekChart />

      <div className="scrollbar-none -mx-4 mb-3 flex gap-2 overflow-x-auto px-4">
        {TYPE_FILTERS.map((type) => (
          <Chip key={type} active={filter.type === type} onClick={() => setFilter((prev) => ({ ...prev, type }))}>
            {t(`history.types.${type}`)}
          </Chip>
        ))}
      </div>
      <div className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        {PERIODS.map((period) => (
          <Chip key={period} active={filter.period === period} onClick={() => setFilter((prev) => ({ ...prev, period }))}>
            {t(`history.periods.${period}`)}
          </Chip>
        ))}
      </div>

      <Section className="mb-4 flex items-center gap-5">
        <ProgressRing value={spentShare} size={112}>
          <p className="text-2xl font-extrabold">{Math.round(spentShare * 100)}%</p>
        </ProgressRing>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <p className="text-sm text-muted">{t('history.spentShare')}</p>
          <div>
            <p className="flex items-center gap-2 text-sm text-muted">
              <span className="size-2.5 rounded-full bg-highlight" /> {t('history.income')}
            </p>
            <Amount value={totals.income} sign="+" className="text-lg font-bold text-positive" />
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm text-muted">
              <span className="size-2.5 rounded-full bg-accent" /> {t('history.expense')}
            </p>
            <Amount value={totals.expense} sign="-" className="text-lg font-bold" />
          </div>
        </div>
      </Section>

      {groups.length === 0 ? (
        <EmptyState icon={ReceiptText} title={t('history.empty')} />
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map(([dayKey, items]) => (
            <Section key={dayKey} title={formatDayLabel(dayKey)}>
              <div className="flex flex-col gap-1">
                {items.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </Section>
          ))}
        </div>
      )}
    </>
  );
};
