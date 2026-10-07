import { z } from 'zod';
import { isExpiryValid } from '@/shared/lib/cardUtils';
import { cardNumberSchema } from '@/shared/lib/validation';

export const cardDetailsSchema = z.object({
  number: cardNumberSchema,
  expiry: z.string().refine((value) => isExpiryValid(value), 'validation.expiry'),
});

export type CardDetailsValues = z.infer<typeof cardDetailsSchema>;
