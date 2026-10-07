export type TransactionType = 'payment' | 'transfer' | 'topup';

export type TransactionStatus = 'success' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  cardId: string;
  /** Номер карты на момент операции — карта может быть удалена позже. */
  cardNumber: string;
  amount: number;
  fee: number;
  title: string;
  providerId?: string;
  details: Record<string, string>;
  failureReason?: string;
  createdAt: string;
}

export const isIncome = (transaction: Pick<Transaction, 'type'>): boolean => transaction.type === 'topup';
