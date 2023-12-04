import React from 'react';
import styled from 'styled-components/native';

import type {SearchBarProps} from './SearchBar.types';
import SearchResultsList from 'components/search-results';

export default function SearchBarComponent({
  searchText,
  setSearchText,
  debouncedGetMetroData,
  metroData,
  getMetroData,
}: SearchBarProps) {
  return (
    <>
      <SearchBar.Input
        placeholder="하차하실 역을 입력해주세요."
        placeholderTextColor={'#666'}
        onChangeText={text => {
          setSearchText(text);
          debouncedGetMetroData(text);
        }}
        value={searchText}
      />

      {searchText && (
        <SearchBar.ClearSearch onPress={() => setSearchText('')}>
          <SearchBar.X source={require('../../assets/icons/close.png')} />
        </SearchBar.ClearSearch>
      )}

      <SearchBar.ResultsContainer>
        <SearchResultsList
          searchText={searchText}
          setSearchText={setSearchText}
          metroData={metroData}
          getMetroData={getMetroData}
        />
      </SearchBar.ResultsContainer>
    </>
  );
}

const SearchBar = {
  Input: styled.TextInput`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-self: center;
    position: absolute;
    z-index: 1;
    top: 20px;
    padding: 10px;
    width: 90%;
    height: 50px;
    border-radius: 13px;
    background-color: #fff;
    border: 1px solid #190c8d;
    color: #0f0f0f;
  `,
  ClearSearch: styled.TouchableOpacity`
    position: absolute;
    z-index: 1;
    top: 35px;
    right: 30px;
    /* padding: 10px; */
  `,
  X: styled.Image`
    width: 20px;
    height: 20px;
  `,
  ResultsContainer: styled.View`
    align-items: center;
    position: absolute;
    z-index: 1;
    top: 70px;
    width: 100%;
  `,
};
