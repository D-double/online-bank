import { useState, type FormEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { MessageSquareText } from 'lucide-react';
import { CardView, type Card, type CardTheme } from '@/entities/card';
import { mockUserFullName } from '@/mocks/user';
import { confirmCardLink, MOCK_OTP_CODE, requestCardLink, type CardLinkRequest } from '@/services/cardService';
import { detectBrand, formatCardNumberInput, formatExpiryInput } from '@/shared/lib/cardUtils';
import { getErrorKey } from '@/shared/lib/errors';
import { digitsOnly } from '@/shared/lib/format';
import { Button, ErrorAlert, Input } from '@/shared/ui';
import { cardDetailsSchema, type CardDetailsValues } from './schema';
import { ThemePicker } from './ThemePicker';

const OTP_LENGTH = MOCK_OTP_CODE.length;

interface AddCardFlowProps {
  onSuccess: (card: Card) => void;
}

interface OtpStepProps {
  request: CardLinkRequest;
  phoneMask: string;
  onSuccess: (card: Card) => void;
  onBack: () => void;
}

const OtpStep = ({ request, phoneMask, onSuccess, onBack }: OtpStepProps) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      onSuccess(await confirmCardLink(request, code));
    } catch (err) {
      setError(t(getErrorKey(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-brand-500/10 text-brand-500">
          <MessageSquareText className="size-8" />
        </span>
        <p className="text-fg-soft">{t('addCard.otpSent', { phone: phoneMask })}</p>
        <p className="rounded-xl bg-amber-500/10 px-3 py-1.5 text-sm text-amber-600 dark:text-amber-400">
          {t('addCard.otpHint', { code: MOCK_OTP_CODE })}
        </p>
      </div>
      <Input
        autoFocus
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="••••••"
        className="[&_input]:text-center [&_input]:text-2xl [&_input]:tracking-[0.5em]"
        value={code}
        error={error}
        onChange={(event) => {
          setCode(digitsOnly(event.target.value).slice(0, OTP_LENGTH));
          setError(undefined);
        }}
      />
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onBack} disabled={loading}>
          {t('common.back')}
        </Button>
        <Button type="submit" loading={loading} disabled={code.length !== OTP_LENGTH}>
          {t('common.confirm')}
        </Button>
      </div>
    </form>
  );
};

export const AddCardFlow = ({ onSuccess }: AddCardFlowProps) => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<CardTheme>('ocean');
  const [pending, setPending] = useState<{ request: CardLinkRequest; phoneMask: string }>();
  const [serverError, setServerError] = useState<string>();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CardDetailsValues>({
    resolver: zodResolver(cardDetailsSchema),
    defaultValues: { number: '', expiry: '' },
  });

  const [number, expiry] = watch(['number', 'expiry']);

  const onSubmit = async (values: CardDetailsValues) => {
    setServerError(undefined);
    const request: CardLinkRequest = { number: digitsOnly(values.number), expiry: values.expiry, theme };
    try {
      setPending({ request, phoneMask: await requestCardLink(request) });
    } catch (err) {
      setServerError(t(getErrorKey(err)));
    }
  };

  if (pending) {
    return <OtpStep {...pending} onSuccess={onSuccess} onBack={() => setPending(undefined)} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <CardView
        revealNumber
        hideBalance
        card={{ number, expiry, theme, holder: mockUserFullName, balance: 0, brand: detectBrand(number) }}
      />

      <ThemePicker value={theme} onChange={setTheme} />

      <Controller
        name="number"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            autoFocus
            label={t('addCard.number')}
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            error={errors.number?.message && t(errors.number.message)}
            onChange={(event) => field.onChange(formatCardNumberInput(event.target.value))}
          />
        )}
      />

      <Controller
        name="expiry"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label={t('addCard.expiry')}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            error={errors.expiry?.message && t(errors.expiry.message)}
            onChange={(event) => field.onChange(formatExpiryInput(event.target.value))}
          />
        )}
      />

      {serverError && <ErrorAlert message={serverError} />}

      <Button type="submit" fullWidth loading={isSubmitting}>
        {t('common.continue')}
      </Button>
    </form>
  );
};
