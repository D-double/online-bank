import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger';
type Size = 'md' | 'sm';

interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-gradient text-white shadow-lg shadow-brand-500/30 hover:brightness-110',
  secondary: 'bg-surface-strong text-fg hover:bg-line',
  outline: 'bg-surface text-fg ring-1 ring-line hover:bg-surface-muted',
  danger: 'bg-negative/10 text-negative hover:bg-negative/20',
};

const SIZES: Record<Size, string> = {
  md: 'h-12 px-6',
  sm: 'h-11 px-3 text-sm',
};

const buttonClassName = ({ variant = 'primary', size = 'md', fullWidth = false, className }: ButtonStyleProps): string =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:opacity-50 [&_svg]:shrink-0',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {
  loading?: boolean;
}

export const Button = ({
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={buttonClassName({ variant, size, fullWidth, className })}
    {...rest}
  >
    {loading && <Loader2 className="size-5 animate-spin" />}
    {children}
  </button>
);

type ButtonLinkProps = LinkProps & ButtonStyleProps;

export const ButtonLink = ({ variant, size, fullWidth, className, ...rest }: ButtonLinkProps) => (
  <Link className={buttonClassName({ variant, size, fullWidth, className })} {...rest} />
);
