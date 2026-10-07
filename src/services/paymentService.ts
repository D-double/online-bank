import { findCard, useCardsStore, type Card } from '@/entities/card';
import { calculateFee, findProvider } from '@/entities/provider';
import { useTransactionsStore, type Transaction } from '@/entities/transaction';
import { mockRecipientNames, mockRecipients } from '@/mocks/cards';
import { mockUserFullName } from '@/mocks/user';
import { createId, delay } from '@/shared/lib/async';
import { detectBrand } from '@/shared/lib/cardUtils';
import { AppError, type AppErrorCode } from '@/shared/lib/errors';
import { isValidLuhn } from '@/shared/lib/luhn';

const NETWORK_DELAY_MS = 1200;
const LOOKUP_DELAY_MS = 600;

const TRANSFER_FEE_PERCENT = 0.5;
export const TRANSFER_LIMITS = { min: 1_000, max: 50_000_000 } as const;

type TransactionDraft = Pick<Transaction, 'type' | 'amount' | 'fee' | 'title' | 'providerId' | 'details'>;

const requireCard = (cardId: string): Card => {
  const card = findCard(cardId);
  if (!card) throw new AppError('cardNotFound');
  return card;
};

const getChargeFailure = (card: Card, total: number): AppErrorCode | undefined => {
  if (card.isBlocked) return 'cardBlocked';
  if (card.balance < total) return 'insufficientFunds';
  return undefined;
};

const recordTransaction = (card: Card, draft: TransactionDraft, failureReason?: AppErrorCode): Transaction => {
  const transaction: Transaction = {
    ...draft,
    id: createId(),
    cardId: card.id,
    cardNumber: card.number,
    status: failureReason ? 'failed' : 'success',
    failureReason,
    createdAt: new Date().toISOString(),
  };
  useTransactionsStore.getState().addTransaction(transaction);
  return transaction;
};

/** Списывает сумму с комиссией. Неуспешная попытка тоже попадает в историю, как в реальных банковских приложениях. */
const charge = (card: Card, draft: TransactionDraft): Transaction => {
  const failure = getChargeFailure(card, draft.amount + draft.fee);
  const transaction = recordTransaction(card, draft, failure);
  if (failure) throw new AppError(failure);

  useCardsStore.getState().changeBalance(card.id, -(draft.amount + draft.fee));
  return transaction;
};

const findOwnCardByNumber = (number: string): Card | undefined =>
  useCardsStore.getState().cards.find((card) => card.number === number);

const pickMockName = (number: string): string => {
  const hash = [...number].reduce((sum, digit) => sum + Number(digit), 0);
  return mockRecipientNames[hash % mockRecipientNames.length];
};

/** Переводы между своими картами бесплатны. */
export const getTransferFeePercent = (recipientNumber: string): number =>
  findOwnCardByNumber(recipientNumber) ? 0 : TRANSFER_FEE_PERCENT;

export const calculateTransferFee = (amount: number, recipientNumber: string): number =>
  calculateFee(amount, getTransferFeePercent(recipientNumber));

export interface PaymentRequest {
  cardId: string;
  providerId: string;
  amount: number;
  details: Record<string, string>;
}

export const pay = async ({ cardId, providerId, amount, details }: PaymentRequest): Promise<Transaction> => {
  await delay(NETWORK_DELAY_MS);

  const provider = findProvider(providerId);
  if (!provider) throw new AppError('providerNotFound');
  if (amount < provider.min || amount > provider.max) throw new AppError('amountOutOfRange');

  return charge(requireCard(cardId), {
    type: 'payment',
    amount,
    fee: calculateFee(amount, provider.feePercent),
    title: provider.name,
    providerId,
    details,
  });
};

export const lookupRecipient = async (number: string): Promise<string> => {
  await delay(LOOKUP_DELAY_MS);

  if (!isValidLuhn(number) || !detectBrand(number)) throw new AppError('invalidCard');
  if (findOwnCardByNumber(number)) return mockUserFullName;
  return mockRecipients[number] ?? pickMockName(number);
};

export interface TransferRequest {
  cardId: string;
  recipientNumber: string;
  amount: number;
}

export const transfer = async ({ cardId, recipientNumber, amount }: TransferRequest): Promise<Transaction> => {
  const card = requireCard(cardId);
  if (card.number === recipientNumber) throw new AppError('sameCard');
  if (amount < TRANSFER_LIMITS.min || amount > TRANSFER_LIMITS.max) throw new AppError('amountOutOfRange');

  const recipientName = await lookupRecipient(recipientNumber);
  await delay(NETWORK_DELAY_MS);

  const transaction = charge(requireCard(cardId), {
    type: 'transfer',
    amount,
    fee: calculateTransferFee(amount, recipientNumber),
    title: recipientName,
    details: { recipientCard: recipientNumber, recipientName },
  });

  const ownRecipientCard = findOwnCardByNumber(recipientNumber);
  if (ownRecipientCard) {
    useCardsStore.getState().changeBalance(ownRecipientCard.id, amount);
    recordTransaction(ownRecipientCard, {
      type: 'topup',
      amount,
      fee: 0,
      title: mockUserFullName,
      details: { senderCard: card.number },
    });
  }

  return transaction;
};
