import { useTranslation } from 'react-i18next';
import { formatTime } from '@/shared/lib/date';

/**
 * Названия месяцев и шаблон даты берутся из словарей: Intl-данные для узбекской локали
 * есть не во всех браузерах.
 */
export const useDateFormatter = () => {
  const { t } = useTranslation();

  const formatDate = (iso: string): string => {
    const date = new Date(iso);
    const months = t('date.months', { returnObjects: true }) as string[];
    return t('date.format', { day: date.getDate(), month: months[date.getMonth()], year: date.getFullYear() });
  };

  const formatDateTime = (iso: string): string => `${formatDate(iso)}, ${formatTime(iso)}`;

  return { formatDate, formatDateTime };
};
