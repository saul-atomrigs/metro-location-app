import React from 'react';
import styled from 'styled-components/native';
import type {SearchBarProps} from './SearchBar.types';

export default function SearchBar({
  searchText,
  setSearchText,
  debouncedGetMetroData,
}: SearchBarProps) {
  return (
    <>
      <SearchBarInput
        placeholder="하차하실 역을 입력해주세요."
        onChangeText={text => {
          setSearchText(text);
          debouncedGetMetroData(text);
        }}
        value={searchText}
      />
      {searchText && (
        <RemoveSearchTextButton onPress={() => setSearchText('')}>
          <CloseButton source={require('../../assets/icons/close.png')} />
        </RemoveSearchTextButton>
      )}
    </>
  );
}

const SearchBarInput = styled.TextInput`
  z-index: 1;
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
  position: absolute;
  background-color: #fff;
  top: 20px;
  padding: 10px;
  border-radius: 13px;
  border: 1px solid #190c8d;
`;

const RemoveSearchTextButton = styled.TouchableOpacity`
  position: absolute;
  right: 30px;
  top: 35px;
  z-index: 2;
`;

const CloseButton = styled.Image`
  width: 20px;
  height: 20px;
`;
