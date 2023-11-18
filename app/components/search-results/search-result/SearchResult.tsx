import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';

type SearchResultProps = {
  result: string;
  metroLine: string;
  setSearchText: (text: string) => void;
  getMetroData: (text: string) => void;
};

export default function SearchResult({
  result,
  metroLine,
  setSearchText,
  getMetroData,
}: SearchResultProps) {
  const handlePressSearchResult = () => {
    setSearchText(result);
    getMetroData(result);
  };

  return (
    <SearchResultBox onPress={handlePressSearchResult}>
      <Text>
        {result} ({metroLine})
      </Text>
    </SearchResultBox>
  );
}

const SearchResultBox = styled.TouchableOpacity`
  margin: 10px;
`;
