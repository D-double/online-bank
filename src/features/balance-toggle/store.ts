import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BalanceVisibilityState {
  hidden: boolean;
  toggle: () => void;
}

export const useBalanceVisibility = create<BalanceVisibilityState>()(
  persist(
    (set) => ({
      hidden: false,
      toggle: () => set(({ hidden }) => ({ hidden: !hidden })),
    }),
    { name: 'bank-balance-visibility' },
  ),
);
