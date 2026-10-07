const numberFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });

export const formatNumber = (value: number): string => numberFormatter.format(value);

export const digitsOnly = (value: string): string => value.replace(/\D/g, '');

export const formatAmountInput = (value: string): string => {
  const digits = digitsOnly(value).replace(/^0+(?=\d)/, '').slice(0, 12);
  return digits ? formatNumber(Number(digits)) : '';
};

export const parseAmount = (value: string): number => Number(digitsOnly(value)) || 0;

const groupDigits = (digits: string, groups: number[], separator = ' '): string => {
  const parts: string[] = [];
  let cursor = 0;
  for (const size of groups) {
    if (cursor >= digits.length) break;
    parts.push(digits.slice(cursor, cursor + size));
    cursor += size;
  }
  return parts.join(separator);
};

/** Локальная часть узбекского номера без +998: `90 123 45 67` */
export const formatPhoneInput = (value: string): string =>
  groupDigits(digitsOnly(value).slice(0, 9), [2, 3, 2, 2]);

export const formatPhone = (localDigits: string): string => `+998 ${formatPhoneInput(localDigits)}`;
