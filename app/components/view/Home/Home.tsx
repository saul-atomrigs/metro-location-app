// 외부 라이브러리
// import {Text} from 'react-native';
import React from 'react';

// 내부 라이브러리
import CustomText, {TextVariant} from 'component-library/Text';
import styled from 'styled-components/native';

export default function Home() {
  return (
    <TextContainer>
      <CustomText>Ho</CustomText>
    </TextContainer>
  );
}

const TextContainer = styled.View`
  background-color: #333;
`;
