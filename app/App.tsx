import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';
import {colors} from 'styles/common';
import Home from 'components/view/Home';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode
      ? colors.blackTransparent
      : colors.blackTransparent,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Home />
    </SafeAreaView>
  );
}

export default App;
