import {Text} from 'react-native';
import React from 'react';
import styled from 'styled-components/native';

export default function Home() {
  return (
    <TextContainer>
      <Text>Home</Text>
    </TextContainer>
  );
}

const TextContainer = styled.View`
  background-color: #333;
`;
