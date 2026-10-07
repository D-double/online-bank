import type { LucideIcon } from 'lucide-react';

export type CategoryId =
  | 'mobile'
  | 'internet'
  | 'utilities'
  | 'tv'
  | 'transport'
  | 'taxes'
  | 'education'
  | 'games';

export interface Category {
  id: CategoryId;
  icon: LucideIcon;
}

/**
 * phone — локальная часть номера +998 (9 цифр);
 * digits — только цифры длиной от minLength до maxLength;
 * text — произвольная строка длиной от minLength до maxLength.
 */
export type ProviderFieldKind = 'phone' | 'digits' | 'text';

export interface ProviderField {
  key: string;
  kind: ProviderFieldKind;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

export interface Provider {
  id: string;
  categoryId: CategoryId;
  name: string;
  logo: { short: string; className: string };
  fields: ProviderField[];
  feePercent: number;
  min: number;
  max: number;
}
