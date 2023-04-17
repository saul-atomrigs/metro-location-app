/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, TextInput, Keyboard} from 'react-native';
import Config from 'react-native-config';
import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
} from 'react-native-nmap';
import styled from 'styled-components/native';

import isIos from 'util/device';

export default function Home() {
  const URL = `http://openapi.seoul.go.kr:8088/${Config.SEOUL_METRO_API_KEY}/json/subwayStationMaster/1/5/`;
  const INITIAL_POSITION = {latitude: 37.570161, longitude: 126.982923};
  console.log('URL', URL);

  const [metroData, setMetroData] = useState();
  const [P0, setP0] = useState(INITIAL_POSITION);

  useEffect(() => {
    getMetroData();
  }, []);

  const getMetroData = async () => {
    try {
      const response = await axios.get(URL);
      const rawData = response.data.subwayStationMaster.row;
      setMetroData(rawData);
      setP0({
        latitude: Number(metroData[1].CRDNT_Y),
        longitude: Number(metroData[1].CRDNT_X),
      });
      console.log(P0);
    } catch (error) {
      console.log('error', error);
    }
  };

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
      <TextInput
        style={{width: '80%', height: '10%'}}
        placeholder="하차할 지하철역을 입력해주세요."
      />
    </KeyboardAvoidingView>
  );
}

const TextContainer = styled.View`
  background-color: #333;
`;
