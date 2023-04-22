/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, TextInput, Keyboard, Button} from 'react-native';
import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
} from 'react-native-nmap';
import styled from 'styled-components/native';

import isIos from 'util/device';
import {MetroDataProps, MetroRowData, SearchResult} from './Home.types';
import {URL, INITIAL_POSITION} from './Home.constants';
import {useForm, Controller} from 'react-hook-form';
import Text from 'component-library/Text';
import SearchResultsList from 'components/SearchResultsList';

export default function Home() {
  const [metroData, setMetroData] = useState<MetroDataProps[]>([]);
  const [P0, setP0] = useState(INITIAL_POSITION);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      searchResult: '',
    },
  });

  const onSubmit = (data: SearchResult) => getMetroData(data);

  const getMetroData = async (data: SearchResult) => {
    try {
      const response = await axios.get(URL);
      const metroRowData = response.data.subwayStationMaster.row;
      // console.log('metroData', metroRowData);
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

  const MOCK_DATA = ['서울역', '시청역', '종각역'];

  return (
    <KeyboardAvoidingView behavior={isIos ? 'padding' : 'height'}>
      <NaverMapView
        style={{width: '100%', height: '80%'}}
        showsMyLocationButton={true}
        center={{...P0, zoom: 16}}
        onTouch={() => {}}
        // onCameraChange={e => console.log('onCameraChange', JSON.stringify(e))}
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
      {/* <SearchResultsList results={MOCK_DATA} /> */}
    </KeyboardAvoidingView>
  );
}
