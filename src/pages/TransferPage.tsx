import { useTranslation } from 'react-i18next';
import { TransferFlow } from '@/features/transfer';
import { PageHeader, Section } from '@/shared/ui';

export const TransferPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('transfer.title')} />
      <Section>
        <TransferFlow />
      </Section>
    </>
  );
};
