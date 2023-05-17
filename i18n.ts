import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from 'public/static/locales/en.json';
// Configure i18n
i18n
    .use(initReactI18next) // Initialize react-i18next
    .init({
        lng: 'en', // Default language
        fallbackLng: 'en', // Fallback language
        resources: {
            en: { translation: en },
        },
    });

export default i18n;
