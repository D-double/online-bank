import { digitsOnly } from './format';

export const CARD_NUMBER_LENGTH = 16;

export type CardBrand = 'uzcard' | 'humo' | 'visa' | 'mastercard';

const BRAND_PATTERNS: ReadonlyArray<[CardBrand, RegExp]> = [
  ['uzcard', /^(8600|5614)/],
  ['humo', /^9860/],
  ['visa', /^4/],
  ['mastercard', /^(5[1-5]|2[2-7])/],
];

export const detectBrand = (number: string): CardBrand | null => {
  const digits = digitsOnly(number);
  return BRAND_PATTERNS.find(([, pattern]) => pattern.test(digits))?.[0] ?? null;
};

export const formatCardNumberInput = (value: string): string =>
  digitsOnly(value)
    .slice(0, CARD_NUMBER_LENGTH)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

export const maskCardNumber = (number: string): string => {
  const digits = digitsOnly(number);
  return `${digits.slice(0, 4)} •••• •••• ${digits.slice(-4)}`;
};

export const shortCardMask = (number: string): string => `•• ${digitsOnly(number).slice(-4)}`;

export const formatExpiryInput = (value: string): string => {
  const digits = digitsOnly(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export const isExpiryValid = (expiry: string, now = new Date()): boolean => {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;

  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth >= now;
};
