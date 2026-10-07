import type { Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { formatAmountInput, formatNumber } from '@/shared/lib/format';
import { Chip } from './Chip';
import { Input } from './Input';

interface AmountFieldProps {
  ref?: Ref<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  presets?: number[];
}

export const AmountField = ({ ref, value, onChange, onBlur, error, hint, presets = [] }: AmountFieldProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <Input
        ref={ref}
        label={t('payment.amount')}
        inputMode="numeric"
        placeholder="0"
        value={value}
        onBlur={onBlur}
        onChange={(event) => onChange(formatAmountInput(event.target.value))}
        suffix={t('common.currency')}
        error={error}
      />
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {presets.length > 0 && (
        <div className="scrollbar-none flex gap-2 overflow-x-auto">
          {presets.map((preset) => (
            <Chip key={preset} onClick={() => onChange(formatNumber(preset))}>
              {formatNumber(preset)}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
};
