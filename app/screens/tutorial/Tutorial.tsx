import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import MapAnimation from 'components/map-animation/MapAnimation';
import {requestGeolocationPermissions} from 'util/geolocation';

export default function Tutorial() {
  const [isGeolocationPermissionGranted, setIsGeolocationPermissionGranted] =
    useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleAgreePress = async () => {
    const result = await requestGeolocationPermissions();
    setIsGeolocationPermissionGranted(result);
  };

  useEffect(() => {
    if (isGeolocationPermissionGranted) {
      navigation.navigate('Home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGeolocationPermissionGranted]);

  return (
    <TutorialContainer>
      <View>
        <TutorialTitle>위치 정보 수집을 위한 권한 요청</TutorialTitle>

        <TutorialDescription>
          내리세요 앱의 필수 기능을 위해 귀하의 위치 정보를 수집합니다.
        </TutorialDescription>
      </View>

      <MapAnimation />

      <Button onPress={handleAgreePress}>
        <ButtonText>위치 정보 수집에 동의합니다.</ButtonText>
      </Button>
    </TutorialContainer>
  );
}

const TutorialContainer = styled.View`
  flex: 1;
  justify-content: space-between;
  background-color: #fff;
  padding: 20px;
`;

const TutorialTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
`;

const TutorialDescription = styled.Text`
  font-size: 16px;
  line-height: 22px;
  color: #2d2c2c;
  margin-bottom: 20px;
`;

const Button = styled.TouchableOpacity`
  background-color: #190c8d;
  padding: 10px;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  text-align: center;
`;
