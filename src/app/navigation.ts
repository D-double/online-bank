import { ArrowLeftRight, CreditCard, History, House, Receipt, UserRound, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', labelKey: 'nav.home', icon: House },
  { to: '/cards', labelKey: 'nav.cards', icon: CreditCard },
  { to: '/payments', labelKey: 'nav.payments', icon: Receipt },
  { to: '/transfer', labelKey: 'nav.transfer', icon: ArrowLeftRight },
  { to: '/history', labelKey: 'nav.history', icon: History },
];

export const SIDEBAR_ITEMS: NavItem[] = [...NAV_ITEMS, { to: '/profile', labelKey: 'nav.profile', icon: UserRound }];
