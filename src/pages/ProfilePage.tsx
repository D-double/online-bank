import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw } from 'lucide-react';
import { useCardsStore } from '@/entities/card';
import { useTransactionsStore } from '@/entities/transaction';
import { LanguageSwitcher } from '@/features/language-switcher';
import { ThemeSwitcher } from '@/features/theme-switcher';
import { mockRecipients } from '@/mocks/cards';
import { mockUser } from '@/mocks/user';
import { MOCK_OTP_CODE } from '@/services/cardService';
import { formatCardNumberInput } from '@/shared/lib/cardUtils';
import { formatPhone } from '@/shared/lib/format';
import { Button, ConfirmSheet, PageHeader, Section } from '@/shared/ui';

const resetDemoData = () => {
  useCardsStore.getState().reset();
  useTransactionsStore.getState().reset();
};

export const ProfilePage = () => {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <PageHeader title={t('profile.title')} />

      <Section className="mb-4">
        <div className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full bg-brand-gradient text-xl font-bold text-white">
            {mockUser.firstName[0]}
            {mockUser.lastName[0]}
          </span>
          <div>
            <p className="text-lg font-bold">
              {mockUser.firstName} {mockUser.lastName}
            </p>
            <p className="text-muted">{formatPhone(mockUser.phone)}</p>
          </div>
        </div>
      </Section>

      <Section title={t('profile.language')} className="mb-4">
        <LanguageSwitcher />
      </Section>

      <Section title={t('profile.theme')} className="mb-4">
        <ThemeSwitcher />
      </Section>

      <Section title={t('profile.demoTitle')} className="mb-4">
        <ul className="flex flex-col gap-2 text-sm text-fg-soft">
          <li>{t('profile.demoOtp', { code: MOCK_OTP_CODE })}</li>
          <li>{t('profile.demoRecipients')}</li>
          {Object.entries(mockRecipients).map(([number, name]) => (
            <li key={number} className="flex justify-between gap-2 rounded-xl bg-surface-muted px-3 py-2">
              <span className="font-mono">{formatCardNumberInput(number)}</span>
              <span className="truncate text-muted">{name}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Button variant="danger" fullWidth onClick={() => setConfirmOpen(true)}>
        <RotateCcw className="size-5" /> {t('profile.reset')}
      </Button>

      <ConfirmSheet
        open={confirmOpen}
        title={t('profile.reset')}
        message={t('profile.resetMessage')}
        confirmLabel={t('profile.resetConfirm')}
        onConfirm={resetDemoData}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
};
