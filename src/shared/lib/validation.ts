import { z } from 'zod';
import { CARD_NUMBER_LENGTH, detectBrand } from './cardUtils';
import { digitsOnly } from './format';
import { isValidLuhn } from './luhn';

/** Номер карты в отформатированном виде (`8600 1234 ...`); сообщения — ключи переводов. */
export const cardNumberSchema = z
  .string()
  .refine((value) => digitsOnly(value).length === CARD_NUMBER_LENGTH, 'validation.cardLength')
  .refine((value) => isValidLuhn(digitsOnly(value)), 'validation.cardInvalid')
  .refine((value) => detectBrand(value) !== null, 'validation.cardUnsupported');
