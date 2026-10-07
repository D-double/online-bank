import { useCardsStore, type Card, type CardTheme } from '@/entities/card';
import { mockUser, mockUserFullName } from '@/mocks/user';
import { delay } from '@/shared/lib/async';
import { detectBrand } from '@/shared/lib/cardUtils';
import { AppError } from '@/shared/lib/errors';
import { formatPhone } from '@/shared/lib/format';
import { isValidLuhn } from '@/shared/lib/luhn';

const NETWORK_DELAY_MS = 900;

/** Демо-код из SMS: в реальном приложении его присылает процессинг. */
export const MOCK_OTP_CODE = '123456';

export interface CardLinkRequest {
  number: string;
  expiry: string;
  theme: CardTheme;
}

const randomMockBalance = (): number => Math.round((50_000 + Math.random() * 5_000_000) / 1_000) * 1_000;

/** Проверяет карту в «процессинге» и отправляет SMS-код. Возвращает номер телефона, куда отправлен код. */
export const requestCardLink = async ({ number }: CardLinkRequest): Promise<string> => {
  await delay(NETWORK_DELAY_MS);

  if (!isValidLuhn(number) || !detectBrand(number)) throw new AppError('invalidCard');
  if (useCardsStore.getState().cards.some((card) => card.number === number)) throw new AppError('duplicateCard');

  return formatPhone(mockUser.phone).replace(/\d{3} \d{2}(?= \d{2}$)/, '*** **');
};

export const confirmCardLink = async (request: CardLinkRequest, code: string): Promise<Card> => {
  await delay(NETWORK_DELAY_MS);

  if (code !== MOCK_OTP_CODE) throw new AppError('wrongOtp');

  const brand = detectBrand(request.number);
  if (!brand) throw new AppError('invalidCard');

  return useCardsStore.getState().addCard({
    ...request,
    brand,
    holder: mockUserFullName,
    balance: randomMockBalance(),
  });
};
