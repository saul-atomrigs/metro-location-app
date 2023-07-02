import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';
import {RecoilRoot} from 'recoil';

import Home from 'screens/Home';
import {colors} from 'styles/common';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.white,
    flex: 1,
  };

  return (
    <RecoilRoot>
      <SafeAreaView style={backgroundStyle}>
        <Home />
      </SafeAreaView>
    </RecoilRoot>
  );
}
