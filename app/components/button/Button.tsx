import React from 'react';
import styled from 'styled-components/native';
import type {ButtonProps} from './Button.types';

export default function Button({onPress, title, buttonStyle}: ButtonProps) {
  return (
    <PrimaryButton onPress={onPress} buttonStyle={buttonStyle}>
      <PrimaryButtonText>{title}</PrimaryButtonText>
    </PrimaryButton>
  );
}

const PrimaryButton = styled.TouchableOpacity<{
  buttonStyle: 'primary' | 'danger';
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  position: relative;
  bottom: 25%;
  height: 50px;
  width: 90%;
  margin-bottom: 10px;
  background-color: ${({buttonStyle}) =>
    buttonStyle === 'primary' ? '#190c8d' : '#b50404'};
  border-radius: 13px;
`;

const PrimaryButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
`;
