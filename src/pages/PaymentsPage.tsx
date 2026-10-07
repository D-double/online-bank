import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Search, SearchX } from 'lucide-react';
import {
  CATEGORIES,
  getProvidersByCategory,
  isCategoryId,
  PROVIDERS,
  ProviderLogo,
  type Provider,
} from '@/entities/provider';
import { cn } from '@/shared/lib/cn';
import { Chip, EmptyState, Input, PageHeader, Section } from '@/shared/ui';

const CATEGORY_PARAM = 'category';

const ProviderList = ({ providers }: { providers: Provider[] }) => {
  const { t } = useTranslation();

  if (providers.length === 0) return <EmptyState icon={SearchX} title={t('payments.notFound')} />;

  return (
    <div className="flex flex-col gap-1">
      {providers.map((provider) => (
        <Link
          key={provider.id}
          to={`/payments/${provider.id}`}
          className="-mx-2 flex items-center gap-3 rounded-2xl p-2 hover:bg-surface-muted"
        >
          <ProviderLogo provider={provider} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{provider.name}</p>
            <p className="text-sm text-muted">
              {provider.feePercent > 0 ? t('payments.fee', { fee: provider.feePercent }) : t('payments.noFee')}
            </p>
          </div>
          <ChevronRight className="size-5 text-subtle" />
        </Link>
      ))}
    </div>
  );
};

export const PaymentsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');

  const categoryParam = searchParams.get(CATEGORY_PARAM);
  const activeCategory = isCategoryId(categoryParam) ? categoryParam : null;
  const normalizedQuery = query.trim().toLowerCase();

  const providers = normalizedQuery
    ? PROVIDERS.filter((provider) => provider.name.toLowerCase().includes(normalizedQuery))
    : activeCategory
      ? getProvidersByCategory(activeCategory)
      : PROVIDERS;

  const selectCategory = (categoryId: string | null) =>
    setSearchParams(categoryId ? { [CATEGORY_PARAM]: categoryId } : {}, { replace: true });

  return (
    <>
      <PageHeader title={t('payments.title')} />

      <Input
        className="mb-4"
        placeholder={t('payments.search')}
        prefix={<Search className="size-5" />}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {!normalizedQuery && (
        <>
          <div className="mb-4 grid grid-cols-4 gap-2">
            {CATEGORIES.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => selectCategory(activeCategory === id ? null : id)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-2xl p-2 text-center transition-colors',
                  activeCategory === id ? 'bg-surface shadow-sm' : 'hover:bg-surface/60',
                )}
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-strong">
                  <Icon className="size-6" />
                </span>
                <span className="text-xs leading-tight font-semibold">{t(`categories.${id}`)}</span>
              </button>
            ))}
          </div>

          {activeCategory && (
            <div className="mb-4 flex">
              <Chip onClick={() => selectCategory(null)}>{t('payments.allCategories')}</Chip>
            </div>
          )}
        </>
      )}

      <Section title={activeCategory && !normalizedQuery ? t(`categories.${activeCategory}`) : t('payments.providers')}>
        <ProviderList providers={providers} />
      </Section>
    </>
  );
};
