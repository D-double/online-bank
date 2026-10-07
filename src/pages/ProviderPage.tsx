import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { findProvider, ProviderLogo } from '@/entities/provider';
import { PayProviderFlow } from '@/features/pay-provider';
import { PageHeader, Section } from '@/shared/ui';

export const ProviderPage = () => {
  const { t } = useTranslation();
  const { providerId = '' } = useParams();
  const provider = findProvider(providerId);

  if (!provider) return <Navigate to="/payments" replace />;

  return (
    <>
      <PageHeader back title={t('payments.payTitle')} />
      <Section>
        <div className="mb-5 flex items-center gap-3">
          <ProviderLogo provider={provider} className="size-14" />
          <div>
            <p className="text-lg font-bold">{provider.name}</p>
            <p className="text-sm text-muted">{t(`categories.${provider.categoryId}`)}</p>
          </div>
        </div>
        <PayProviderFlow key={provider.id} provider={provider} />
      </Section>
    </>
  );
};
