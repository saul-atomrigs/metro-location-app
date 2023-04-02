import React from 'react';
import {SafeAreaView, Text, useColorScheme} from 'react-native';
import Home from 'components/view/Home';
import {RecoilRoot} from 'recoil';
import {colors} from 'styles/common';
import {translate as t} from './locale';

export default function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.white,
  };

  return (
    <RecoilRoot>
      <SafeAreaView style={backgroundStyle}>
        <Home />
        <Text>{t('hello')}</Text>
      </SafeAreaView>
    </RecoilRoot>
  );
}
