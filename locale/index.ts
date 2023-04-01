import * as RNLocalize from 'react-native-localize';
import {I18nManager} from 'react-native';
import {createIntl, createIntlCache} from '@formatjs/intl';

const translations = {
  ko: require('./kr.json'),
  en: require('./en.json'),
} as const;

export type Translation = keyof typeof translations;

// 알맞은 언어가 없으면 default로 보여줄 언어(한국어):
const fallback = {languageTag: 'kr', isRTL: false};

const {languageTag, isRTL} =
  RNLocalize.findBestAvailableLanguage(Object.keys(translations)) ?? fallback;

// 왼쪽으로 시작하는 언어인지 확인하고 알맞게 설정:
I18nManager.forceRTL(isRTL);

const intl = createIntl(
  {
    defaultLocale: 'en',
    locale: languageTag,
    messages: translations[languageTag as Translation],
  },
  createIntlCache(),
);

type TranslationParams = Parameters<(typeof intl)['formatMessage']>[1];

export const translate = (key: string, params?: TranslationParams) =>
  intl
    .formatMessage({id: key, defaultMessage: translations.en[key]}, params)
    .toString();
