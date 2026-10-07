import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftRight, CreditCard, Receipt, Smartphone, type LucideIcon } from 'lucide-react';
import { CardView, selectTotalBalance, useCardsStore } from '@/entities/card';
import { findProvider, POPULAR_PROVIDER_IDS, ProviderLogo, type Provider } from '@/entities/provider';
import { getBalanceHistory, TransactionItem, useTransactionsStore } from '@/entities/transaction';
import { AddCardTile } from '@/features/add-card';
import { BalanceToggle, useBalanceVisibility } from '@/features/balance-toggle';
import { ThemeToggle } from '@/features/theme-switcher';
import { mockUser } from '@/mocks/user';
import { cn } from '@/shared/lib/cn';
import { Amount, AreaChart, EmptyState, Section } from '@/shared/ui';

const RECENT_TRANSACTIONS_COUNT = 5;
const BALANCE_TREND_DAYS = 30;

const QUICK_ACTIONS: { to: string; labelKey: string; icon: LucideIcon; className: string }[] = [
  { to: '/payments', labelKey: 'home.actions.pay', icon: Receipt, className: 'bg-violet-500/15 text-violet-500' },
  { to: '/transfer', labelKey: 'home.actions.transfer', icon: ArrowLeftRight, className: 'bg-fuchsia-500/15 text-fuchsia-500' },
  { to: '/payments?category=mobile', labelKey: 'home.actions.mobile', icon: Smartphone, className: 'bg-cyan-500/15 text-cyan-500' },
  { to: '/cards', labelKey: 'home.actions.cards', icon: CreditCard, className: 'bg-blue-500/15 text-blue-500' },
];

const popularProviders = POPULAR_PROVIDER_IDS.map(findProvider).filter((provider): provider is Provider => Boolean(provider));

const HERO_BUTTON_CLASS = 'bg-white/15 hover:bg-white/25';

const Greeting = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <Link to="/profile" className="grid size-12 place-items-center rounded-full bg-white/20 font-bold ring-2 ring-white/30">
        {mockUser.firstName[0]}
        {mockUser.lastName[0]}
      </Link>
      <div className="flex-1">
        <p className="text-sm text-white/75">{t('home.greeting')}</p>
        <p className="text-lg font-bold">{mockUser.firstName}</p>
      </div>
      <ThemeToggle className={HERO_BUTTON_CLASS} />
    </div>
  );
};

const TotalBalance = () => {
  const { t } = useTranslation();
  const total = useCardsStore(selectTotalBalance);
  const hidden = useBalanceVisibility((state) => state.hidden);
  const transactions = useTransactionsStore((state) => state.transactions);
  const history = useMemo(() => getBalanceHistory(transactions, total, BALANCE_TREND_DAYS), [transactions, total]);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        <p className="text-sm text-white/75">{t('home.totalBalance')}</p>
        <BalanceToggle className={HERO_BUTTON_CLASS} />
      </div>
      <Amount value={total} hidden={hidden} className="block text-3xl font-extrabold" />
      <AreaChart values={history} className="mt-4 h-20 text-white" />
      <p className="mt-2 text-xs text-white/70">{t('home.balanceTrend')}</p>
    </div>
  );
};

/** На мобильных растягивается на всю ширину и продолжает градиентную шапку, на десктопе — карточка. */
const Hero = () => (
  <header className="-mx-4 -mt-5 mb-5 rounded-b-[2rem] bg-brand-gradient px-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-5 text-white shadow-xl shadow-brand-500/25 lg:mx-0 lg:mt-0 lg:rounded-[2rem] lg:p-6">
    <Greeting />
    <TotalBalance />
  </header>
);

const CardsCarousel = () => {
  const cards = useCardsStore((state) => state.cards);
  const hidden = useBalanceVisibility((state) => state.hidden);

  return (
    <div className="scrollbar-none -mx-4 mb-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pt-1 pb-3">
      {cards.map((card) => (
        <Link key={card.id} to="/cards" className="w-[85%] shrink-0 snap-center sm:w-80">
          <CardView card={card} hideBalance={hidden} />
        </Link>
      ))}
      <AddCardTile className="w-[85%] shrink-0 snap-center sm:w-80" />
    </div>
  );
};

const QuickActions = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-5 grid grid-cols-4 gap-2">
      {QUICK_ACTIONS.map(({ to, labelKey, icon: Icon, className }) => (
        <Link key={to} to={to} className="flex flex-col items-center gap-2 rounded-2xl p-2 text-center hover:bg-surface">
          <span className={cn('grid size-14 place-items-center rounded-2xl', className)}>
            <Icon className="size-6" />
          </span>
          <span className="text-xs leading-tight font-semibold">{t(labelKey)}</span>
        </Link>
      ))}
    </div>
  );
};

const PopularProviders = () => {
  const { t } = useTranslation();

  return (
    <Section title={t('home.popular')} className="mb-5">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {popularProviders.map((provider) => (
          <Link
            key={provider.id}
            to={`/payments/${provider.id}`}
            className="flex flex-col items-center gap-2 rounded-2xl p-2 text-center hover:bg-surface-muted"
          >
            <ProviderLogo provider={provider} />
            <span className="line-clamp-2 text-xs font-medium">{provider.name}</span>
          </Link>
        ))}
      </div>
    </Section>
  );
};

const RecentTransactions = () => {
  const { t } = useTranslation();
  const transactions = useTransactionsStore((state) => state.transactions);
  const recent = transactions.slice(0, RECENT_TRANSACTIONS_COUNT);

  return (
    <Section
      title={t('home.recent')}
      action={
        <Link to="/history" className="text-sm font-semibold text-brand-strong">
          {t('common.all')}
        </Link>
      }
    >
      {recent.length === 0 ? (
        <EmptyState icon={Receipt} title={t('history.empty')} />
      ) : (
        <div className="flex flex-col gap-1">
          {recent.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </Section>
  );
};

export const HomePage = () => (
  <>
    <Hero />
    <CardsCarousel />
    <QuickActions />
    <PopularProviders />
    <RecentTransactions />
  </>
);
