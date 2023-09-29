import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';
import {RecoilRoot} from 'recoil';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './screens/Home';
import Tutorial from './screens/tutorial/Tutorial';
import {colors} from './styles/common';

export default function App() {
  const Stack = createNativeStackNavigator();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.white,
    flex: 1,
  };

  return (
    <RecoilRoot>
      <SafeAreaView style={backgroundStyle}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Tutorial">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen
              name="Tutorial"
              component={Tutorial}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </RecoilRoot>
  );
}
