import { z } from 'zod';
import type { Provider, ProviderField } from '@/entities/provider';
import { digitsOnly, parseAmount } from '@/shared/lib/format';

const PHONE_LENGTH = 9;

const isLengthInRange = (length: number, { minLength = 1, maxLength = Infinity }: ProviderField): boolean =>
  length >= minLength && length <= maxLength;

const buildFieldSchema = (field: ProviderField) => {
  switch (field.kind) {
    case 'phone':
      return z.string().refine((value) => digitsOnly(value).length === PHONE_LENGTH, 'validation.phone');
    case 'digits':
      return z
        .string()
        .refine(
          (value) => isLengthInRange(digitsOnly(value).length, field),
          field.minLength === field.maxLength ? 'validation.digitsExact' : 'validation.digitsLength',
        );
    case 'text':
      return z.string().refine((value) => isLengthInRange(value.trim().length, field), 'validation.textLength');
  }
};

export const buildPaymentSchema = (provider: Provider) =>
  z.object({
    fields: z.object(Object.fromEntries(provider.fields.map((field) => [field.key, buildFieldSchema(field)]))),
    amount: z.string().refine((value) => {
      const amount = parseAmount(value);
      return amount >= provider.min && amount <= provider.max;
    }, 'validation.amountRange'),
    cardId: z.string().min(1, 'validation.selectCard'),
  });

export interface PaymentFormValues {
  fields: Record<string, string>;
  amount: string;
  cardId: string;
}

/** Значения полей в «сыром» виде (без пробелов и форматирования) для сохранения в транзакции. */
export const normalizeFieldValues = (provider: Provider, values: Record<string, string>): Record<string, string> =>
  Object.fromEntries(
    provider.fields.map((field) => [field.key, field.kind === 'text' ? values[field.key].trim() : digitsOnly(values[field.key])]),
  );
