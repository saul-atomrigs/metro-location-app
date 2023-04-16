/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
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
  const P0 = {latitude: 37.564362, longitude: 126.977011};

  const getMetroData = async () => {
    const URL = `http://openapi.seoul.go.kr:8088/${Config.SEOUL_METRO_API_KEY}/xml/subwayStationMaster/1/5/`;
    const response = await fetch(URL);
    console.log(response);
    return response.json();
  };

  useEffect(() => {
    // getMetroData();
  }, []);

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
