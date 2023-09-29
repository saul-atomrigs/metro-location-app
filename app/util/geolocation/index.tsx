import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

async function requestGeolocationPermissions() {
  if (Platform.OS === 'ios') {
    const auth = await Geolocation.requestAuthorization('whenInUse');
    if (auth === 'granted') {
      console.log('ios geolocation permission granted');
      return true;
    } else {
      console.log('ios geolocation permission denied');
      return false;
    }
  } else {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (PermissionsAndroid.RESULTS.GRANTED === 'granted') {
      console.log('android geolocation permission granted');
      return true;
    } else {
      console.log('android geolocation permission denied');
      return false;
    }
  }
}

export {requestGeolocationPermissions};
