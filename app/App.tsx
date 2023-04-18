import React from 'react';
import {SafeAreaView, Text, useColorScheme} from 'react-native';
import {RecoilRoot} from 'recoil';
import Geolocation from 'react-native-geolocation-service';

import Home from 'screens/Home';
import {colors} from 'styles/common';
import {translate as t} from 'locale/';
import {requestPermissions} from 'util/geolocation';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.white,
  };

  React.useEffect(() => {
    requestPermissions();
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  return (
    <RecoilRoot>
      <SafeAreaView style={backgroundStyle}>
        <Home />
      </SafeAreaView>
    </RecoilRoot>
  );
}
