import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';

type SearchResultProps = {
  result: string;
  searchText: string;
  setSearchText: (text: string) => void;
  getMetroData: () => void;
};

export default function SearchResult({
  result,
  setSearchText,
  getMetroData,
}: SearchResultProps) {
  const onPressHandler = () => {
    setSearchText(result);
    getMetroData(result);
  };

  return (
    <SearchResultBox
      // onPress={onPress}
      onPress={onPressHandler}>
      <Text>{result}</Text>
    </SearchResultBox>
  );
}

const SearchResultBox = styled.TouchableOpacity`
  margin-bottom: 20px;
  margin-horizontal: 5px;
`;
