import {View} from 'react-native';
import React from 'react';
import SearchResult from 'components/SearchResult';

type SearchResultsListProps = {
  results: string[];
};

export default function SearchResultsList({results}: SearchResultsListProps) {
  return (
    <View>
      {results.map(result => {
        return <SearchResult result={result} />;
      })}
    </View>
  );
}
