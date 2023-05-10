/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, TextInput, Keyboard, Button} from 'react-native';
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
import {RecoilState, atom, useRecoilState} from 'recoil';
import Geolocation from 'react-native-geolocation-service';
import notifee, {AndroidImportance} from '@notifee/react-native';

import {MetroDataProps, MetroRowData, SearchResult} from './Home.types';
import {URL, INITIAL_POSITION} from './Home.constants';
import Text from 'component-library/Text';
import SearchResultsList from 'components/SearchResultsList';
import {requestPermissions} from 'util/geolocation';
import isIos from 'util/device';

export default function Home() {
  /** 지하철역 좌표 */
  const [metroData, setMetroData] = useState<MetroDataProps[]>([]);
  const [P0, setP0] = useState(INITIAL_POSITION);
  // console.log('1. P0 position--', P0.latitude);
  // console.log('1. P0 position--', P0.longitude);

  /** 유저의 현재 Geolocation 좌표 */
  const [currentPosition, setCurrentPosition] = useState<any>({});
  const {latitude, longitude} = currentPosition?.coords || {};
  // console.log('2. current position', latitude);
  // console.log('2. current position', longitude);

  useEffect(() => {
    requestPermissions();
    Geolocation.getCurrentPosition(
      position => {
        setCurrentPosition(position);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

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
        title: '지하철 앱',
        body: '이번 역에서 내리세요!',
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  /** UI */

  return (
    <KeyboardAvoidingView behavior={isIos ? 'padding' : 'height'}>
      <Button
        title="Display Notification"
        onPress={() => onDisplayNotification()}
      />
      <NaverMapView
        style={{width: '100%', height: '80%'}}
        showsMyLocationButton={true}
        center={{...P0, zoom: 16}}
        onTouch={() => {}}
        onMapClick={() => Keyboard.dismiss()}>
        <Marker coordinate={P0} onClick={() => console.warn('onClick! p0')} />
      </NaverMapView>
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
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </KeyboardAvoidingView>
  );
}
