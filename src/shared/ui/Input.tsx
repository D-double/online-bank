import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { cn } from '@/shared/lib/cn';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export const Input = ({ label, error, prefix, suffix, className, id, ref, ...rest }: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex h-13 items-center gap-2 rounded-2xl border bg-surface-muted px-4 transition-colors focus-within:bg-surface',
          error
            ? 'border-negative'
            : 'border-line focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15',
        )}
      >
        {prefix && <span className="shrink-0 font-medium text-muted">{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          className="h-full w-full min-w-0 bg-transparent text-base font-medium outline-none placeholder:font-normal placeholder:text-subtle"
          {...rest}
        />
        {suffix && <span className="shrink-0 text-muted">{suffix}</span>}
      </div>
      {error && <p className="text-sm text-negative">{error}</p>}
    </div>
  );
};
