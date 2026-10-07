import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CardSelect, selectDefaultPaymentCardId, useCardsStore } from '@/entities/card';
import { calculateFee, type Provider } from '@/entities/provider';
import { formatDetailValue } from '@/entities/transaction';
import { pay } from '@/services/paymentService';
import { shortCardMask } from '@/shared/lib/cardUtils';
import { getErrorKey } from '@/shared/lib/errors';
import { formatNumber, parseAmount } from '@/shared/lib/format';
import { Amount, AmountField, Button, DetailsList, ErrorAlert, type DetailsItem } from '@/shared/ui';
import { ProviderFieldInput } from './ProviderFieldInput';
import { buildPaymentSchema, normalizeFieldValues, type PaymentFormValues } from './schema';

const AMOUNT_PRESETS = [5_000, 10_000, 20_000, 50_000, 100_000];

interface PayProviderFlowProps {
  provider: Provider;
}

export const PayProviderFlow = ({ provider }: PayProviderFlowProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cards = useCardsStore((state) => state.cards);
  const defaultCardId = useCardsStore(selectDefaultPaymentCardId);
  const schema = useMemo(() => buildPaymentSchema(provider), [provider]);

  const [confirmed, setConfirmed] = useState<PaymentFormValues>();
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string>();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fields: Object.fromEntries(provider.fields.map((field) => [field.key, ''])),
      amount: '',
      cardId: defaultCardId,
    },
  });

  const amount = parseAmount(watch('amount'));
  const fee = calculateFee(amount, provider.feePercent);
  const presets = AMOUNT_PRESETS.filter((preset) => preset >= provider.min && preset <= provider.max);

  const submitPayment = async (values: PaymentFormValues) => {
    setPaying(true);
    setPaymentError(undefined);
    try {
      const transaction = await pay({
        cardId: values.cardId,
        providerId: provider.id,
        amount: parseAmount(values.amount),
        details: normalizeFieldValues(provider, values.fields),
      });
      navigate(`/history/${transaction.id}`, { replace: true, state: { justCompleted: true } });
    } catch (err) {
      setPaymentError(t(getErrorKey(err)));
    } finally {
      setPaying(false);
    }
  };

  if (confirmed) {
    const card = cards.find((item) => item.id === confirmed.cardId);
    const details = normalizeFieldValues(provider, confirmed.fields);
    const confirmedAmount = parseAmount(confirmed.amount);
    const confirmedFee = calculateFee(confirmedAmount, provider.feePercent);
    const items: DetailsItem[] = [
      { label: t('payment.provider'), value: provider.name },
      ...provider.fields.map((field) => ({
        label: t(`fields.${field.key}`),
        value: formatDetailValue(field.key, details[field.key]),
      })),
      { label: t('payment.fromCard'), value: card ? shortCardMask(card.number) : '—' },
      { label: t('payment.amount'), value: <Amount value={confirmedAmount} /> },
      { label: t('payment.fee'), value: <Amount value={confirmedFee} /> },
      { label: t('payment.total'), value: <Amount value={confirmedAmount + confirmedFee} />, emphasized: true },
    ];

    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">{t('payment.confirmTitle')}</h2>
        <DetailsList items={items} />
        {paymentError && <ErrorAlert message={paymentError} />}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" disabled={paying} onClick={() => setConfirmed(undefined)}>
            {t('common.back')}
          </Button>
          <Button loading={paying} onClick={() => submitPayment(confirmed)}>
            {t('payment.pay')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((values) => {
        setPaymentError(undefined);
        setConfirmed(values);
      })}
    >
      {provider.fields.map((field, index) => (
        <Controller
          key={field.key}
          name={`fields.${field.key}`}
          control={control}
          render={({ field: { ref, value, onChange, onBlur } }) => (
            <ProviderFieldInput
              ref={ref}
              autoFocus={index === 0}
              field={field}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={errors.fields?.[field.key]?.message}
            />
          )}
        />
      ))}

      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <AmountField
            ref={field.ref}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            presets={presets}
            hint={t('payment.limits', { min: formatNumber(provider.min), max: formatNumber(provider.max) })}
            error={
              errors.amount?.message &&
              t(errors.amount.message, { min: formatNumber(provider.min), max: formatNumber(provider.max) })
            }
          />
        )}
      />

      <Controller
        name="cardId"
        control={control}
        render={({ field }) => (
          <CardSelect
            cards={cards}
            value={field.value}
            onChange={field.onChange}
            error={errors.cardId?.message && t(errors.cardId.message)}
          />
        )}
      />

      <div className="rounded-2xl bg-surface-muted p-4 text-sm">
        <div className="flex justify-between text-muted">
          <span>{t('payment.fee')} ({provider.feePercent}%)</span>
          <Amount value={fee} />
        </div>
        <div className="mt-1 flex justify-between font-bold">
          <span>{t('payment.total')}</span>
          <Amount value={amount + fee} />
        </div>
      </div>

      <Button type="submit" fullWidth>
        {t('common.continue')}
      </Button>
    </form>
  );
};
