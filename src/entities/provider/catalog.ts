import { Gamepad2, GraduationCap, House, Landmark, Smartphone, TramFront, Tv, Wifi } from 'lucide-react';
import type { Category, CategoryId, Provider, ProviderField } from './types';

export const CATEGORIES: Category[] = [
  { id: 'mobile', icon: Smartphone },
  { id: 'internet', icon: Wifi },
  { id: 'utilities', icon: House },
  { id: 'tv', icon: Tv },
  { id: 'transport', icon: TramFront },
  { id: 'taxes', icon: Landmark },
  { id: 'education', icon: GraduationCap },
  { id: 'games', icon: Gamepad2 },
];

const phoneField: ProviderField = { key: 'phone', kind: 'phone', placeholder: '90 123 45 67' };
const accountField: ProviderField = { key: 'account', kind: 'digits', placeholder: '12345678', minLength: 6, maxLength: 12 };
const contractField: ProviderField = { key: 'contract', kind: 'digits', placeholder: '1002003', minLength: 5, maxLength: 10 };
const loginField: ProviderField = { key: 'login', kind: 'text', placeholder: 'user123', minLength: 3, maxLength: 32 };
const playerIdField: ProviderField = { key: 'playerId', kind: 'digits', placeholder: '5123456789', minLength: 6, maxLength: 12 };

const mobile = (id: string, name: string, short: string, className: string): Provider => ({
  id,
  categoryId: 'mobile',
  name,
  logo: { short, className },
  fields: [phoneField],
  feePercent: 0,
  min: 1_000,
  max: 1_000_000,
});

export const PROVIDERS: Provider[] = [
  mobile('beeline', 'Beeline', 'B', 'bg-yellow-400 text-slate-900'),
  mobile('ucell', 'Ucell', 'U', 'bg-purple-600 text-white'),
  mobile('mobiuz', 'Mobiuz', 'M', 'bg-red-500 text-white'),
  mobile('uzmobile', 'Uzmobile', 'UZ', 'bg-sky-500 text-white'),
  mobile('perfectum', 'Perfectum Mobile', 'P', 'bg-green-600 text-white'),

  {
    id: 'uztelecom',
    categoryId: 'internet',
    name: 'Uztelecom',
    logo: { short: 'UT', className: 'bg-blue-600 text-white' },
    fields: [accountField],
    feePercent: 0,
    min: 5_000,
    max: 5_000_000,
  },
  {
    id: 'turontelecom',
    categoryId: 'internet',
    name: 'Turon Telecom',
    logo: { short: 'TT', className: 'bg-cyan-600 text-white' },
    fields: [loginField],
    feePercent: 0.5,
    min: 5_000,
    max: 5_000_000,
  },
  {
    id: 'sarkor',
    categoryId: 'internet',
    name: 'Sarkor Telecom',
    logo: { short: 'S', className: 'bg-orange-500 text-white' },
    fields: [loginField],
    feePercent: 0.5,
    min: 5_000,
    max: 5_000_000,
  },

  {
    id: 'elektr',
    categoryId: 'utilities',
    name: 'Hududiy elektr tarmoqlari',
    logo: { short: 'E', className: 'bg-amber-500 text-white' },
    fields: [accountField],
    feePercent: 0,
    min: 1_000,
    max: 10_000_000,
  },
  {
    id: 'hududgaz',
    categoryId: 'utilities',
    name: 'Hududgaz',
    logo: { short: 'HG', className: 'bg-blue-500 text-white' },
    fields: [accountField],
    feePercent: 0,
    min: 1_000,
    max: 10_000_000,
  },
  {
    id: 'suvsoz',
    categoryId: 'utilities',
    name: 'Suvsoz',
    logo: { short: 'SS', className: 'bg-sky-600 text-white' },
    fields: [accountField],
    feePercent: 0,
    min: 1_000,
    max: 5_000_000,
  },
  {
    id: 'tozahudud',
    categoryId: 'utilities',
    name: 'Toza hudud',
    logo: { short: 'TH', className: 'bg-lime-600 text-white' },
    fields: [accountField],
    feePercent: 0,
    min: 1_000,
    max: 2_000_000,
  },

  {
    id: 'uzdigital',
    categoryId: 'tv',
    name: 'UzDigital TV',
    logo: { short: 'UD', className: 'bg-rose-600 text-white' },
    fields: [contractField],
    feePercent: 1,
    min: 10_000,
    max: 1_000_000,
  },
  {
    id: 'itv',
    categoryId: 'tv',
    name: 'Itv.uz',
    logo: { short: 'itv', className: 'bg-slate-900 text-white' },
    fields: [loginField],
    feePercent: 1,
    min: 10_000,
    max: 1_000_000,
  },

  {
    id: 'atto',
    categoryId: 'transport',
    name: 'ATTO',
    logo: { short: 'A', className: 'bg-emerald-600 text-white' },
    fields: [{ key: 'transportCard', kind: 'digits', placeholder: '9860123412341234', minLength: 16, maxLength: 16 }],
    feePercent: 0,
    min: 1_400,
    max: 500_000,
  },
  {
    id: 'yandexgo',
    categoryId: 'transport',
    name: 'Yandex Go',
    logo: { short: 'Y', className: 'bg-yellow-300 text-slate-900' },
    fields: [phoneField],
    feePercent: 1,
    min: 5_000,
    max: 2_000_000,
  },

  {
    id: 'soliq',
    categoryId: 'taxes',
    name: "Davlat soliq qo'mitasi",
    logo: { short: 'DS', className: 'bg-slate-700 text-white' },
    fields: [{ key: 'tin', kind: 'digits', placeholder: '123456789', minLength: 9, maxLength: 9 }],
    feePercent: 0,
    min: 1_000,
    max: 100_000_000,
  },
  {
    id: 'fines',
    categoryId: 'taxes',
    name: 'YHXX jarimalari',
    logo: { short: 'YH', className: 'bg-indigo-700 text-white' },
    fields: [{ key: 'carNumber', kind: 'text', placeholder: '01A123BC', minLength: 6, maxLength: 9 }],
    feePercent: 0,
    min: 10_000,
    max: 50_000_000,
  },

  {
    id: 'kindergarten',
    categoryId: 'education',
    name: "MTT (bog'cha)",
    logo: { short: 'MT', className: 'bg-pink-500 text-white' },
    fields: [accountField],
    feePercent: 0,
    min: 10_000,
    max: 5_000_000,
  },
  {
    id: 'contract',
    categoryId: 'education',
    name: "Kontrakt to'lovi",
    logo: { short: 'KT', className: 'bg-violet-600 text-white' },
    fields: [{ key: 'studentId', kind: 'digits', placeholder: '20240001', minLength: 6, maxLength: 10 }],
    feePercent: 0,
    min: 100_000,
    max: 50_000_000,
  },

  {
    id: 'steam',
    categoryId: 'games',
    name: 'Steam',
    logo: { short: 'St', className: 'bg-slate-800 text-white' },
    fields: [loginField],
    feePercent: 3,
    min: 10_000,
    max: 3_000_000,
  },
  {
    id: 'pubg',
    categoryId: 'games',
    name: 'PUBG Mobile UC',
    logo: { short: 'PG', className: 'bg-amber-600 text-white' },
    fields: [playerIdField],
    feePercent: 2,
    min: 12_000,
    max: 3_000_000,
  },
  {
    id: 'mlbb',
    categoryId: 'games',
    name: 'Mobile Legends',
    logo: { short: 'ML', className: 'bg-blue-800 text-white' },
    fields: [playerIdField],
    feePercent: 2,
    min: 12_000,
    max: 3_000_000,
  },
];

export const POPULAR_PROVIDER_IDS = ['beeline', 'ucell', 'uzmobile', 'elektr', 'hududgaz', 'uztelecom'];

export const findProvider = (id: string): Provider | undefined => PROVIDERS.find((provider) => provider.id === id);

export const getProvidersByCategory = (categoryId: CategoryId): Provider[] =>
  PROVIDERS.filter((provider) => provider.categoryId === categoryId);

export const isCategoryId = (value: string | null): value is CategoryId =>
  CATEGORIES.some((category) => category.id === value);

export const calculateFee = (amount: number, feePercent: number): number => Math.round((amount * feePercent) / 100);
