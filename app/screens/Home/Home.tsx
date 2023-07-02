/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  Keyboard,
  Button,
  Alert,
} from 'react-native';
import axios from 'axios';
import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
} from 'react-native-nmap';
import styled from 'styled-components/native';
import {useForm, Controller} from 'react-hook-form';
import Geolocation from 'react-native-geolocation-service';
import notifee, {AndroidImportance} from '@notifee/react-native';

import {MetroDataProps, MetroRowData, SearchResult} from './Home.types';
import {URL, INITIAL_POSITION} from './Home.constants';
import {requestPermissions} from 'util/geolocation';
import isIos from 'util/device';

export default function Home() {
  /** 유저의 현재 Geolocation 좌표 */
  const [currentPosition, setCurrentPosition] = useState<any>({
    coords: {
      latitude: 0,
      longitude: 0,
    },
  });
  const {latitude, longitude} = currentPosition?.coords || {};

  /** 지하철역 좌표 */
  const [metroData, setMetroData] = useState<MetroDataProps[]>([]);
  const [P0, setP0] = useState(INITIAL_POSITION);
  // const [P0, setP0] = useState({
  //   latitude: latitude,
  //   longitude: longitude,
  // });

  useEffect(() => {
    requestPermissions();
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
  } = useForm({
    defaultValues: {
      searchResult: '',
    },
  });

  /** CONDITIONS */
  const isTargetedStation =
    Math.abs(P0.latitude - latitude) < 0.005 &&
    Math.abs(P0.longitude - longitude) < 0.005;

  console.log('isTargetedStation', isTargetedStation);

  useEffect(() => {
    if (isTargetedStation) {
      onDisplayNotification();
    }
  }, [isTargetedStation]);

  /** HANDLERS */

  const onSubmit = (data: SearchResult) => getMetroData(data);

  const getMetroData = async (data: SearchResult) => {
    try {
      const response = await axios.get(URL);
      const metroRowData = response.data.subwayStationMaster.row;
      setMetroData(metroRowData);
      const filteredData = metroRowData.filter(
        (item: MetroRowData) => item.STATN_NM === data.searchResult,
      );
      setP0({
        latitude: Number(filteredData[0].CRDNT_Y),
        longitude: Number(filteredData[0].CRDNT_X),
      });
    } catch (error) {
      console.log('error', error);
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
      Alert.alert('error', error);
    }
  };

  /** FOREGROUND SERVICE 멈춤: */
  const stopForegroundService = async () => {
    try {
      await notifee.stopForegroundService();
    } catch (error: any) {
      Alert.alert('error', error);
    }
  };

  /** 백그라운드일 때 이벤트 */
  const onBackgroundEvent = () => {
    notifee.onBackgroundEvent(async () => {
      console.log('onBackgroundEvent start in background');
    });
  };

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

  /** UI */

  return (
    <KeyboardAvoidingView behavior={isIos ? 'padding' : 'height'}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="하차하실 역을 입력해주세요."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="searchResult"
      />
      {errors.searchResult && <Text>This is required.</Text>}
      <Button title="도착역 찾기" onPress={handleSubmit(onSubmit)} />

      <Button title="알림 설정" onPress={() => onDisplayNotification()} />
      <Button title="알림 해제" onPress={stopForegroundService} />
      <NaverMapView
        style={{width: '100%', height: '60%'}}
        showsMyLocationButton={false}
        center={{
          latitude: latitude,
          longitude: longitude,
          // ...P0,
          zoom: 16,
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
      <Text>현재위치: {latitude}</Text>
      <Text>현재위치: {longitude}</Text>
      <Text>{String(isTargetedStation)}</Text>
      <Text>
        타깃 역:{P0.latitude} ({P0.latitude - latitude})
      </Text>
      <Text>
        타깃 역:{P0.longitude} ({P0.longitude - longitude})
      </Text>
    </KeyboardAvoidingView>
  );
}
