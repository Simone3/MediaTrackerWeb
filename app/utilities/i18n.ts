// eslint-disable-next-line import/extensions
import en from 'app/resources/lang/lang-en.json';
import { I18n } from 'i18n-js';

const i18nInstance = new I18n({
	en: en
}, {
	defaultLocale: 'en',
	locale: 'en',
	enableFallback: true
});

export const i18n = i18nInstance;
