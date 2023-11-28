import React from 'react';
import styled from 'styled-components/native';

import type {ButtonProps} from './Button.types';

export default function ButtonComponent({
  onPress,
  title,
  buttonStyle,
}: ButtonProps) {
  return (
    <Button.Body onPress={onPress} buttonStyle={buttonStyle}>
      <Button.Text>{title}</Button.Text>
    </Button.Body>
  );
}

const Button = {
  Body: styled.TouchableOpacity<{
    buttonStyle: 'primary' | 'danger' | 'disabled';
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
      buttonStyle === 'primary'
        ? '#190c8d'
        : buttonStyle === 'disabled'
        ? '#666'
        : '#b50404'};
    border-radius: 13px;
  `,

  Text: styled.Text`
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
  `,
};
