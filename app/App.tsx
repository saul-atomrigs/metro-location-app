import React from 'react';
import {SafeAreaView, useColorScheme, I18nManager, Text} from 'react-native';
import {colors} from 'styles/common';
import Home from 'components/view/Home';
import * as RNLocalize from 'react-native-localize';
import {createIntl, createIntlCache} from '@formatjs/intl';
import {RecoilRoot} from 'recoil';

const translations = {
  kr: require('../locale/kr.json'),
  en: require('../locale/en.json'),
} as const;

export type Translation = keyof typeof translations;

// fallback if no available language fits
const fallback = {languageTag: 'en', isRTL: false};

const {languageTag, isRTL} =
  RNLocalize.findBestAvailableLanguage(Object.keys(translations)) ?? fallback;

// update layout direction
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

const translate = (key: string, params?: TranslationParams) =>
  intl
    .formatMessage({id: key, defaultMessage: translations['en'][key]}, params)
    .toString();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  console.log(RNLocalize.getLocales());
  console.log(translate('hello'));

  const backgroundStyle = {
    backgroundColor: isDarkMode
      ? colors.blackTransparent
      : colors.blackTransparent,
  };

  return (
    <RecoilRoot>
      <SafeAreaView style={backgroundStyle}>
        <Home />
        <Text>{translate('hello')}</Text>
      </SafeAreaView>
    </RecoilRoot>
  );
}

export default App;
