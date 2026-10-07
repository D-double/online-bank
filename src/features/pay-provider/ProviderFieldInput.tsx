import type { Ref } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProviderField } from '@/entities/provider';
import { digitsOnly, formatPhoneInput } from '@/shared/lib/format';
import { Input } from '@/shared/ui';

interface ProviderFieldInputProps {
  ref?: Ref<HTMLInputElement>;
  field: ProviderField;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  autoFocus?: boolean;
}

const formatValue = (field: ProviderField, value: string): string => {
  switch (field.kind) {
    case 'phone':
      return formatPhoneInput(value);
    case 'digits':
      return digitsOnly(value).slice(0, field.maxLength);
    case 'text':
      return value.slice(0, field.maxLength);
  }
};

export const ProviderFieldInput = ({ ref, field, value, onChange, onBlur, error, autoFocus }: ProviderFieldInputProps) => {
  const { t } = useTranslation();
  const isPhone = field.kind === 'phone';

  return (
    <Input
      ref={ref}
      autoFocus={autoFocus}
      label={t(`fields.${field.key}`)}
      placeholder={field.placeholder}
      inputMode={field.kind === 'text' ? 'text' : 'numeric'}
      type={isPhone ? 'tel' : 'text'}
      prefix={isPhone ? '+998' : undefined}
      value={value}
      onBlur={onBlur}
      onChange={(event) => onChange(formatValue(field, event.target.value))}
      error={error && t(error, { min: field.minLength, max: field.maxLength })}
    />
  );
};
