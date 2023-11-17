import React, {useEffect, useState} from 'react';
import {Keyboard, NativeModules, Platform} from 'react-native';
import axios from 'axios';
import NaverMapView, {Circle, Marker} from 'react-native-nmap';
import styled from 'styled-components/native';
import {useForm, Controller} from 'react-hook-form';
import Geolocation from 'react-native-geolocation-service';
import notifee from '@notifee/react-native';
import {debounce} from 'lodash';

import type {MetroRowData, SearchResult} from './Home.types';
import {
  URL,
  INITIAL_POSITION,
  TARGET_LOCATION_DISTANCE,
  ZERO_COORDS,
} from './Home.constants';
import {
  requestGeolocationPermissions,
  targetStation,
  watchCurrentPosition,
} from 'util/geolocation';
import SearchResultsList from 'components/SearchResultsList';
import {displayNotifee} from 'util/notification';

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

  /** REACT-HOOK-FORM */
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SearchResult>({
    defaultValues: {
      searchResult: '',
    },
  });

  /** CONDITIONS */
  const isTargetedStation =
    Math.abs(searchMetroCoords.latitude - latitude) <
      TARGET_LOCATION_DISTANCE &&
    Math.abs(searchMetroCoords.longitude - longitude) <
      TARGET_LOCATION_DISTANCE;

  const isTargetedLocation2 = targetStation(
    searchMetroCoords,
    latitude,
    longitude,
  );

  console.log(isTargetedStation === isTargetedLocation2);

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

  const {StatusBarManager} = NativeModules;
  useEffect(() => {
    Platform.OS === 'ios'
      ? StatusBarManager.getHeight(statusBarFrameData => {
          setStatusBarHeight(statusBarFrameData.height);
        })
      : null;
  }, []);

  const [statusBarHeight, setStatusBarHeight] = useState(0);

  /** UI */

  return (
    <StyledKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={statusBarHeight + 54}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <>
            <SearchBarInput
              placeholder="하차하실 역을 입력해주세요."
              onBlur={onBlur}
              onChangeText={text => {
                setSearchText(text);
                debouncedGetMetroData(text);
                onChange(text);
              }}
              value={searchText}
            />
            {searchText && (
              <RemoveSearchTextButton onPress={() => setSearchText('')}>
                <CloseButton source={require('../../assets/icons/close.png')} />
              </RemoveSearchTextButton>
            )}
          </>
        )}
        name="searchResult"
      />

      <SearchListContainer>
        <SearchResultsList
          searchText={searchText}
          setSearchText={setSearchText}
          metroData={metroData}
          getMetroData={getMetroData}
          searchMetroCoords={searchMetroCoords}
          setSearchMetroCoords={setSearchMetroCoords}
        />
      </SearchListContainer>

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

      {/* 알림 설정: */}
      <PrimaryButton onPress={() => onDisplayNotification()}>
        <PrimaryButtonText>알림 설정</PrimaryButtonText>
      </PrimaryButton>

      {/* 알림 해제: */}
      <DangerButton onPress={stopForegroundService}>
        <PrimaryButtonText>알림 해제</PrimaryButtonText>
      </DangerButton>
    </StyledKeyboardAvoidingView>
  );
}

const StyledKeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1;
  position: relative;
`;

const SearchBarInput = styled.TextInput`
  z-index: 1;
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
  position: absolute;
  background-color: #fff;
  top: 20px;
  padding: 10px;
  border-radius: 13px;
  border: 1px solid #190c8d;
`;

const RemoveSearchTextButton = styled.TouchableOpacity`
  position: absolute;
  right: 30px;
  top: 35px;
  z-index: 2;
`;

const CloseButton = styled.Image`
  width: 20px;
  height: 20px;
`;

const SearchListContainer = styled.View`
  align-items: center;
  z-index: 1;
  top: 70px;
`;

const PrimaryButton = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  position: relative;
  bottom: 25%;
  height: 50px;
  width: 90%;
  margin-bottom: 10px;
  background-color: #190c8d;
  border-radius: 13px;
`;

const DangerButton = styled(PrimaryButton)`
  background-color: #b50404;
`;

const PrimaryButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
`;

const NaverMapViewContainer = {
  height: '100%',
  width: '100%',
};
