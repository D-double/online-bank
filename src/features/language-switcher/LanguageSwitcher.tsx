import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/shared/i18n';
import { SegmentedControl, type SegmentedOption } from '@/shared/ui';

const OPTIONS: SegmentedOption<string>[] = LANGUAGES.map(({ code, label }) => ({ value: code, label }));

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return <SegmentedControl options={OPTIONS} value={i18n.language} onChange={(code) => i18n.changeLanguage(code)} />;
};
