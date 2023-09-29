import React from 'react';
import LottieView from 'lottie-react-native';
import styled from 'styled-components/native';

export default function MapAnimation() {
  return (
    <LottieContainer>
      <LottieView
        source={require('../../assets/map-animation.json')}
        autoPlay
        loop
        style={lottieDimensions}
      />
    </LottieContainer>
  );
}

const LottieContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const lottieDimensions = {
  width: 300,
  height: 300,
};
