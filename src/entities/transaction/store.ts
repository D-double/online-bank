import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions } from '@/mocks/transactions';
import type { Transaction } from './types';

interface TransactionsState {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  reset: () => void;
}

export const useTransactionsStore = create<TransactionsState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      addTransaction: (transaction) => set(({ transactions }) => ({ transactions: [transaction, ...transactions] })),
      reset: () => set({ transactions: mockTransactions }),
    }),
    { name: 'bank-transactions', version: 1 },
  ),
);
