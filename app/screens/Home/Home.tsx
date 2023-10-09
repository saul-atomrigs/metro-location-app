import React, {useEffect, useState} from 'react';
import {View, Keyboard, NativeModules, Platform} from 'react-native';
import axios from 'axios';
import NaverMapView, {Circle, Marker} from 'react-native-nmap';
import styled from 'styled-components/native';
import {useForm, Controller} from 'react-hook-form';
import Geolocation from 'react-native-geolocation-service';
import notifee, {AndroidImportance} from '@notifee/react-native';

import type {MetroRowData, SearchResult} from './Home.types';
import {URL, INITIAL_POSITION} from './Home.constants';
import {requestGeolocationPermissions} from 'util/geolocation';
import SearchResultsList from 'components/SearchResultsList';

export default function Home() {
  /** 유저의 현재 Geolocation 좌표 */
  const [currentPosition, setCurrentPosition] = useState({
    coords: {
      latitude: 0,
      longitude: 0,
    },
  });
  const {latitude, longitude} = currentPosition?.coords || {};

  /** 지하철역 좌표 */
  const [metroData, setMetroData] = useState<MetroRowData[]>([]);
  const [P0, setP0] = useState(INITIAL_POSITION);

  useEffect(() => {
    requestGeolocationPermissions();
    Geolocation.watchPosition(
      position => {
        setCurrentPosition(position);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, interval: 1000, distanceFilter: 1},
    );
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

  const [searchText, setSearchText] = useState('');

  /** CONDITIONS */
  const isTargetedStation =
    Math.abs(P0.latitude - latitude) < 0.005 &&
    Math.abs(P0.longitude - longitude) < 0.005;

  useEffect(() => {
    if (isTargetedStation) {
      onDisplayNotification();
    }
  }, [isTargetedStation]);

  /** 지하철역 정보 API CALL */
  const getMetroData = async (searchTerm: string) => {
    try {
      const response = await axios.get(URL);
      const metroRowData = response.data.subwayStationMaster.row;
      setMetroData(metroRowData);
      const filteredData = metroData.filter(
        // (item: MetroRowData) => item.STATN_NM === searchText,
        (item: MetroRowData) => item.STATN_NM === searchTerm,
      );
      setP0({
        latitude: Number(filteredData[0].CRDNT_Y),
        longitude: Number(filteredData[0].CRDNT_X),
      });
    } catch (error) {
      console.log('getMetroData error', error);
    }
  };

  /** NOTIFEE 알람 (FOREGROUND SERVICE) */
  const onDisplayNotification = async () => {
    try {
      // (required for iOS)
      await notifee.requestPermission();

      // (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        id: '123',
        title: '지하철 앱',
        body: '내리세요 서비스를 시작합니다',
        android: {
          channelId,
          asForegroundService: true, // registerForegroundService에서 등록한 runner에 bound됨
          pressAction: {
            id: 'default',
          },
        },
      });
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
  // const onBackgroundEvent = () => {
  notifee.onBackgroundEvent(async () => {
    console.log('onBackgroundEvent start in background');
  });
  // };

  notifee.registerForegroundService(() => {
    return new Promise(() => {
      Geolocation.watchPosition(async position => {
        let currentLatitude = position.coords.latitude;
        let currentLongitude = position.coords.longitude;
        if (
          Math.abs(currentLatitude - P0.latitude) < 0.005 &&
          Math.abs(currentLongitude - P0.longitude) < 0.005
        ) {
          const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
          });
          notifee.displayNotification({
            id: '123',
            title: '지하철 앱',
            body: '이번 역에서 내리세요',
            android: {
              channelId,
              pressAction: {
                id: 'default',
              },
            },
          });
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
                getMetroData(text);
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
          // onPress={handleSubmit(() => getMetroData())}
          getMetroData={getMetroData}
          P0={P0}
          setP0={setP0}
        />
      </SearchListContainer>

      <NaverMapView
        style={NaverMapViewContainer}
        showsMyLocationButton={false}
        center={{
          // latitude: latitude,
          // longitude: longitude,
          ...P0,
          zoom: 14,
        }}
        // 해당하는 좌표로 화면을 이동:
        // animateToCoordinate={{
        // latitude,
        // longitude,
        // P0,
        // }}
        onTouch={() => {}}
        onMapClick={() => Keyboard.dismiss()}>
        <Marker
          coordinate={
            // 지하철역에 마커를 찍는다:
            // {latitude, longitude}
            P0
          }
          onClick={() => console.warn('onClick! p0')}
        />
        <Circle coordinate={P0} radius={300} color={'rgba(255,0,0,0.3)'} />
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
