import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2, UserRound } from 'lucide-react';
import { CardSelect, selectDefaultPaymentCardId, useCardsStore } from '@/entities/card';
import {
  calculateTransferFee,
  getTransferFeePercent,
  transfer,
  TRANSFER_LIMITS,
} from '@/services/paymentService';
import { formatCardNumberInput, maskCardNumber, shortCardMask } from '@/shared/lib/cardUtils';
import { getErrorKey } from '@/shared/lib/errors';
import { digitsOnly, formatNumber, parseAmount } from '@/shared/lib/format';
import { Amount, AmountField, Button, Chip, DetailsList, ErrorAlert, Input, type DetailsItem } from '@/shared/ui';
import { transferSchema, type TransferFormValues } from './schema';
import { useRecipientLookup } from './useRecipientLookup';

const AMOUNT_PRESETS = [50_000, 100_000, 500_000, 1_000_000];
const LIMITS_TEXT = { min: formatNumber(TRANSFER_LIMITS.min), max: formatNumber(TRANSFER_LIMITS.max) };

interface ConfirmedTransfer extends TransferFormValues {
  recipientName: string;
}

export const TransferFlow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cards = useCardsStore((state) => state.cards);
  const defaultCardId = useCardsStore(selectDefaultPaymentCardId);

  const [confirmed, setConfirmed] = useState<ConfirmedTransfer>();
  const [sending, setSending] = useState(false);
  const [transferError, setTransferError] = useState<string>();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: { recipient: '', amount: '', cardId: defaultCardId },
  });

  const [recipient, amountValue] = watch(['recipient', 'amount']);
  const recipientDigits = digitsOnly(recipient);
  const lookup = useRecipientLookup(recipientDigits);
  const amount = parseAmount(amountValue);
  const fee = calculateTransferFee(amount, recipientDigits);

  const submitTransfer = async ({ cardId, recipient: recipientNumber, amount: value }: ConfirmedTransfer) => {
    setSending(true);
    setTransferError(undefined);
    try {
      const transaction = await transfer({
        cardId,
        recipientNumber: digitsOnly(recipientNumber),
        amount: parseAmount(value),
      });
      navigate(`/history/${transaction.id}`, { replace: true, state: { justCompleted: true } });
    } catch (err) {
      setTransferError(t(getErrorKey(err)));
    } finally {
      setSending(false);
    }
  };

  if (confirmed) {
    const card = cards.find((item) => item.id === confirmed.cardId);
    const confirmedAmount = parseAmount(confirmed.amount);
    const confirmedFee = calculateTransferFee(confirmedAmount, digitsOnly(confirmed.recipient));
    const items: DetailsItem[] = [
      { label: t('fields.recipientName'), value: confirmed.recipientName },
      { label: t('fields.recipientCard'), value: maskCardNumber(confirmed.recipient) },
      { label: t('payment.fromCard'), value: card ? shortCardMask(card.number) : '—' },
      { label: t('payment.amount'), value: <Amount value={confirmedAmount} /> },
      { label: t('payment.fee'), value: <Amount value={confirmedFee} /> },
      { label: t('payment.total'), value: <Amount value={confirmedAmount + confirmedFee} />, emphasized: true },
    ];

    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">{t('transfer.confirmTitle')}</h2>
        <DetailsList items={items} />
        {transferError && <ErrorAlert message={transferError} />}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" disabled={sending} onClick={() => setConfirmed(undefined)}>
            {t('common.back')}
          </Button>
          <Button loading={sending} onClick={() => submitTransfer(confirmed)}>
            {t('transfer.send')}
          </Button>
        </div>
      </div>
    );
  }

  const recipientHint = lookup.loading ? (
    <span className="flex items-center gap-2 text-sm text-muted">
      <Loader2 className="size-4 animate-spin" /> {t('transfer.searching')}
    </span>
  ) : lookup.name ? (
    <span className="flex items-center gap-2 rounded-xl bg-brand-500/10 px-3 py-2 text-sm font-semibold text-brand-strong">
      <UserRound className="size-4" /> {lookup.name}
    </span>
  ) : null;

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((values) => {
        if (!lookup.name) return;
        setTransferError(undefined);
        setConfirmed({ ...values, recipientName: lookup.name });
      })}
    >
      <div className="flex flex-col gap-2">
        <Controller
          name="recipient"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              autoFocus
              label={t('fields.recipientCard')}
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              onChange={(event) => field.onChange(formatCardNumberInput(event.target.value))}
              error={
                (errors.recipient?.message && t(errors.recipient.message)) ||
                (lookup.errorKey && t(lookup.errorKey))
              }
            />
          )}
        />
        {recipientHint}
        {cards.length > 1 && (
          <div className="scrollbar-none flex items-center gap-2 overflow-x-auto">
            <span className="shrink-0 text-xs text-muted">{t('transfer.ownCards')}:</span>
            {cards.map((card) => (
              <Chip
                key={card.id}
                onClick={() => setValue('recipient', formatCardNumberInput(card.number), { shouldValidate: true })}
              >
                {shortCardMask(card.number)}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <AmountField
            ref={field.ref}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            presets={AMOUNT_PRESETS}
            hint={t('payment.limits', LIMITS_TEXT)}
            error={errors.amount?.message && t(errors.amount.message, LIMITS_TEXT)}
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
          <span>
            {t('payment.fee')} ({getTransferFeePercent(recipientDigits)}%)
          </span>
          <Amount value={fee} />
        </div>
        <div className="mt-1 flex justify-between font-bold">
          <span>{t('payment.total')}</span>
          <Amount value={amount + fee} />
        </div>
      </div>

      <Button type="submit" fullWidth disabled={lookup.loading || !lookup.name}>
        {t('common.continue')}
      </Button>
    </form>
  );
};
