/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import Geolocation from 'react-native-geolocation-service';

notifee.registerForegroundService(() => {
  let currentLatitude = '';
  let currentLongitude = '';
  Geolocation.watchPosition(position => {
    console.log('got position', position);
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
  });
  return new Promise(() => {
    if (
      Math.abs(currentLatitude - 37.566778) < 0.005 &&
      Math.abs(currentLongitude - 126.82731) < 0.005
      //   true
    ) {
      notifee.displayNotification({
        title: 'Foreground Service',
        body: '이번 역에서 내리세요',
        android: {
          channelId: 'default',
        },
      });
    }
  });
});

AppRegistry.registerComponent(appName, () => App);
