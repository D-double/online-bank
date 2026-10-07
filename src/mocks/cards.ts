import type { Card } from '@/entities/card/types';
import { mockUserFullName } from './user';

export const mockCards: Card[] = [
  {
    id: 'card-uzcard',
    number: '8600312945127831',
    holder: mockUserFullName,
    expiry: '09/29',
    brand: 'uzcard',
    balance: 4_250_000,
    theme: 'emerald',
    isMain: true,
    isBlocked: false,
  },
  {
    id: 'card-humo',
    number: '9860020133456127',
    holder: mockUserFullName,
    expiry: '03/28',
    brand: 'humo',
    balance: 1_870_500,
    theme: 'violet',
    isMain: false,
    isBlocked: false,
  },
  {
    id: 'card-visa',
    number: '4278310015549025',
    holder: mockUserFullName,
    expiry: '12/30',
    brand: 'visa',
    balance: 12_400_000,
    theme: 'midnight',
    isMain: false,
    isBlocked: false,
  },
];

/** Справочник «чужих» карт для имитации поиска получателя перевода. */
export const mockRecipients: Record<string, string> = {
  '8600492177361041': 'DILSHOD RAHIMOV',
  '9860355078122494': 'MALIKA YUSUPOVA',
  '5614682210375590': 'JASUR TOSHMATOV',
};

export const mockRecipientNames = ['BOBUR ALIYEV', 'NODIRA SAIDOVA', 'SHERZOD NURMATOV', 'KAMOLA ISMOILOVA'];
