import React, {useEffect, useState} from 'react';
import {Keyboard, NativeModules, Platform} from 'react-native';
import axios from 'axios';
import NaverMapView, {Circle, Marker} from 'react-native-nmap';
import styled from 'styled-components/native';
import Geolocation from 'react-native-geolocation-service';
import notifee from '@notifee/react-native';
import {debounce} from 'lodash';

import type {MetroRowData} from './Home.types';
import {URL, INITIAL_POSITION, ZERO_COORDS} from './Home.constants';
import {
  requestGeolocationPermissions,
  targetStation,
  watchCurrentPosition,
} from 'util/geolocation';
import {displayNotifee} from 'util/notification';
import Button from 'components/button';
import SearchBar from 'components/search-bar';

export default function Home() {
  /** 유저의 현재 Geolocation 좌표 */
  const [currentPosition, setCurrentPosition] = useState(ZERO_COORDS);
  const {latitude, longitude} = currentPosition?.coords || {};

  /** 지하철역 좌표 */
  const [metroData, setMetroData] = useState<MetroRowData[]>([]);
  const [searchMetroCoords, setSearchMetroCoords] = useState(INITIAL_POSITION);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    requestGeolocationPermissions();
    watchCurrentPosition(setCurrentPosition);
  }, []);

  /** CONDITIONS */
  const isTargetedStation = targetStation(
    searchMetroCoords,
    latitude,
    longitude,
  );

  useEffect(() => {
    if (isTargetedStation) {
      onDisplayNotification();
    }
  }, [isTargetedStation]);

  /** 지하철역 정보 API CALL */
  const getMetroData = async (searchTerm: string) => {
    try {
      const response = await axios.get(URL);
      const {row} = response.data.subwayStationMaster;

      setMetroData(row);
      const searchMetro = metroData.filter(
        (item: MetroRowData) => item.STATN_NM === searchTerm,
      );

      const {CRDNT_X, CRDNT_Y} = searchMetro[0];
      setSearchMetroCoords({
        latitude: +CRDNT_Y,
        longitude: +CRDNT_X,
      });
    } catch (error) {
      console.log('getMetroData error', error);
    }
  };

  const debouncedGetMetroData = debounce(getMetroData, 700);

  /** NOTIFEE 알람 (FOREGROUND SERVICE) */
  const onDisplayNotification = async () => {
    try {
      if (Platform.OS === 'ios') {
        await notifee.requestPermission();
      }
      displayNotifee('지하철 앱', '내리세요 서비스를 시작합니다');
    } catch (error: any) {
      console.warn('error', error);
    }
  };

  /** FOREGROUND SERVICE 멈춤: */
  const stopForegroundService = async () => {
    try {
      await notifee.stopForegroundService();
      Geolocation.stopObserving(); // 대체: Geolocation.clearWatch(watchId)
    } catch (error: any) {
      console.warn('error', error);
    }
  };

  /** 백그라운드일 때 이벤트 */
  notifee.onBackgroundEvent(async () => {
    console.log('onBackgroundEvent start in background');
  });

  notifee.registerForegroundService(() => {
    return new Promise(() => {
      Geolocation.watchPosition(async position => {
        let currentLatitude = position.coords.latitude;
        let currentLongitude = position.coords.longitude;
        if (
          targetStation(searchMetroCoords, currentLatitude, currentLongitude)
        ) {
          displayNotifee('도착하였습니다', '이번 역에서 내리세요');
        }
      });
    });
  });

  /** 키보드 올라왔을 때 플랫폼 별 UI 대처 */
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    Platform.OS === 'ios'
      ? NativeModules.StatusBarManager.getHeight(
          (statusBarFrameData: {height: React.SetStateAction<number>}) => {
            setStatusBarHeight(statusBarFrameData.height);
          },
        )
      : null;
  }, []);

  /** UI */

  return (
    <StyledKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={statusBarHeight + 54}>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        debouncedGetMetroData={debouncedGetMetroData}
        metroData={metroData}
        getMetroData={getMetroData}
      />

      <NaverMapView
        style={NaverMapViewContainer}
        showsMyLocationButton={false}
        center={{
          ...searchMetroCoords,
          zoom: 14,
        }}
        // 해당하는 좌표로 화면을 이동:
        // animateToCoordinate={{
        // latitude,
        // longitude,
        // searchMetroCoords,
        // }}
        onTouch={() => {}}
        onMapClick={() => Keyboard.dismiss()}>
        <Marker
          coordinate={searchMetroCoords}
          onClick={() => console.warn('onClick! searchMetroCoords')}
        />
        <Circle
          coordinate={searchMetroCoords}
          radius={300}
          color={'rgba(255,0,0,0.3)'}
        />
      </NaverMapView>

      <Button
        onPress={onDisplayNotification}
        title="알림 설정"
        buttonStyle={searchText === '' ? 'disabled' : 'primary'}
      />

      <Button
        onPress={stopForegroundService}
        title="알림 해제"
        buttonStyle="danger"
      />
    </StyledKeyboardAvoidingView>
  );
}

const StyledKeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1;
  position: relative;
`;

const NaverMapViewContainer = {
  height: '100%',
  width: '100%',
};
