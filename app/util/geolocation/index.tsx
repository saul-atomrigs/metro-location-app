import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {TARGET_LOCATION_DISTANCE} from 'screens/Home/Home.constants';

const requestGeolocationPermissions = async () => {
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
};

const watchCurrentPosition = setCurrentPosition => {
  Geolocation.watchPosition(
    position => setCurrentPosition(position),
    error => console.log(error.code, error.message),
    {enableHighAccuracy: true, interval: 1000, distanceFilter: 1},
  );
};

const targetStation = (searchMetroCoords, latitude, longitude) =>
  Math.abs(searchMetroCoords.latitude - latitude) < TARGET_LOCATION_DISTANCE &&
  Math.abs(searchMetroCoords.longitude - longitude) < TARGET_LOCATION_DISTANCE;

export {requestGeolocationPermissions, watchCurrentPosition, targetStation};
