import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';
import uz from './locales/uz.json';
import en from './locales/en.json';

export const LANGUAGES = [
  { code: 'ru', label: 'Русский' },
  { code: 'uz', label: "O'zbekcha" },
  { code: 'en', label: 'English' },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]['code'];

const STORAGE_KEY = 'bank-language';
const DEFAULT_LANGUAGE: LanguageCode = 'ru';

const isLanguageCode = (value: string | null): value is LanguageCode =>
  LANGUAGES.some((language) => language.code === value);

const storedLanguage = localStorage.getItem(STORAGE_KEY);

i18n.use(initReactI18next).init({
  resources: { ru: { translation: ru }, uz: { translation: uz }, en: { translation: en } },
  lng: isLanguageCode(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
});

const syncDocumentLanguage = (language: string) => {
  document.documentElement.lang = language;
  localStorage.setItem(STORAGE_KEY, language);
};

syncDocumentLanguage(i18n.language);
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
