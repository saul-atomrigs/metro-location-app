// 외부 라이브러리
// import {Text} from 'react-native';
import React from 'react';
import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
} from 'react-native-nmap';

// 내부 라이브러리
import CustomText, {TextVariant} from 'component-library/Text';
import styled from 'styled-components/native';

export default function Home() {
  const P0 = {latitude: 37.564362, longitude: 126.977011};
  const P1 = {latitude: 37.565051, longitude: 126.978567};
  const P2 = {latitude: 37.565383, longitude: 126.976292};

  return (
    <TextContainer>
      <CustomText>Ho</CustomText>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        showsMyLocationButton={true}
        center={{...P0, zoom: 16}}
        onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
        onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
        onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}
      />
    </TextContainer>
  );
}

const TextContainer = styled.View`
  background-color: #333;
`;
