import {Text, View} from 'react-native';
import React from 'react';
// import Text from 'component-library/Text';

type SearchResultProps = {
  result: string;
};

export default function SearchResult({result}: SearchResultProps) {
  return (
    <View>
      <Text>{result}</Text>
    </View>
  );
}
