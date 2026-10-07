import { z } from 'zod';
import { TRANSFER_LIMITS } from '@/services/paymentService';
import { parseAmount } from '@/shared/lib/format';
import { cardNumberSchema } from '@/shared/lib/validation';

export const transferSchema = z.object({
  recipient: cardNumberSchema,
  amount: z.string().refine((value) => {
    const amount = parseAmount(value);
    return amount >= TRANSFER_LIMITS.min && amount <= TRANSFER_LIMITS.max;
  }, 'validation.amountRange'),
  cardId: z.string().min(1, 'validation.selectCard'),
});

export type TransferFormValues = z.infer<typeof transferSchema>;
