 
import { I18n } from 'i18n-js';
import en from 'app/resources/lang/lang-en.json';

const i18nInstance = new I18n({
	en: en
}, {
	defaultLocale: 'en',
	locale: 'en',
	enableFallback: true
});

export const i18n = i18nInstance;
