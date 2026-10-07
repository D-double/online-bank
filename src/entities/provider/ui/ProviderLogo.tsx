import type { Provider } from '../types';
import { cn } from '@/shared/lib/cn';

interface ProviderLogoProps {
  provider: Pick<Provider, 'logo' | 'name'>;
  className?: string;
}

export const ProviderLogo = ({ provider, className }: ProviderLogoProps) => (
  <span
    className={cn(
      'grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-extrabold ring-1 ring-line ring-inset',
      provider.logo.className,
      className,
    )}
    aria-hidden
  >
    {provider.logo.short}
  </span>
);
