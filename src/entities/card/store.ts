import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId } from '@/shared/lib/async';
import { mockCards } from '@/mocks/cards';
import type { Card, NewCard } from './types';

interface CardsState {
  cards: Card[];
  addCard: (card: NewCard) => Card;
  removeCard: (id: string) => void;
  setMainCard: (id: string) => void;
  toggleBlocked: (id: string) => void;
  changeBalance: (id: string, delta: number) => void;
  reset: () => void;
}

const updateCard = (cards: Card[], id: string, patch: (card: Card) => Partial<Card>): Card[] =>
  cards.map((card) => (card.id === id ? { ...card, ...patch(card) } : card));

export const useCardsStore = create<CardsState>()(
  persist(
    (set, get) => ({
      cards: mockCards,

      addCard: (newCard) => {
        const card: Card = { ...newCard, id: createId(), isMain: get().cards.length === 0, isBlocked: false };
        set(({ cards }) => ({ cards: [...cards, card] }));
        return card;
      },

      removeCard: (id) =>
        set(({ cards }) => {
          const rest = cards.filter((card) => card.id !== id);
          const hasMain = rest.some((card) => card.isMain);
          return { cards: hasMain ? rest : rest.map((card, index) => ({ ...card, isMain: index === 0 })) };
        }),

      setMainCard: (id) => set(({ cards }) => ({ cards: cards.map((card) => ({ ...card, isMain: card.id === id })) })),

      toggleBlocked: (id) => set(({ cards }) => ({ cards: updateCard(cards, id, (card) => ({ isBlocked: !card.isBlocked })) })),

      changeBalance: (id, delta) =>
        set(({ cards }) => ({ cards: updateCard(cards, id, (card) => ({ balance: card.balance + delta })) })),

      reset: () => set({ cards: mockCards }),
    }),
    { name: 'bank-cards', version: 1 },
  ),
);

export const selectTotalBalance = (state: CardsState): number =>
  state.cards.reduce((sum, card) => sum + card.balance, 0);

export const selectDefaultPaymentCardId = (state: CardsState): string => {
  const available = state.cards.filter((card) => !card.isBlocked);
  return (available.find((card) => card.isMain) ?? available[0])?.id ?? '';
};

export const findCard = (id: string): Card | undefined =>
  useCardsStore.getState().cards.find((card) => card.id === id);
