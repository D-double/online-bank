import type { CardBrand } from '../types';
import { cn } from '@/shared/lib/cn';

interface CardBrandLogoProps {
  brand: CardBrand;
  className?: string;
}

export const CardBrandLogo = ({ brand, className }: CardBrandLogoProps) => {
  switch (brand) {
    case 'mastercard':
      return (
        <span className={cn('relative inline-flex h-6 w-10', className)} aria-label="Mastercard">
          <span className="absolute left-0 size-6 rounded-full bg-red-500" />
          <span className="absolute right-0 size-6 rounded-full bg-amber-400/90 mix-blend-screen" />
        </span>
      );
    case 'visa':
      return <span className={cn('text-xl font-black italic tracking-tight', className)}>VISA</span>;
    case 'humo':
      return <span className={cn('text-lg font-extrabold tracking-wide', className)}>HUMO</span>;
    case 'uzcard':
      return <span className={cn('text-lg font-extrabold tracking-wide', className)}>UZCARD</span>;
  }
};
