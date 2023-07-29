import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';

import SearchResult from 'components/SearchResult/SearchResult';
import {MetroRowData} from 'screens/Home/Home.types';

type SearchResultsListProps = {
  metroData: MetroRowData[];
  searchText: string;
  setSearchText: (text: string) => void;
  getMetroData: () => void;
};

export default function SearchResultsList({
  metroData,
  searchText,
  setSearchText,
  getMetroData,
  P0,
  setP0,
}: SearchResultsListProps) {
  console.log('P0 --', P0);
  return (
    metroData && (
      <SearchResults>
        {metroData
          .filter(station => {
            if (searchText === '') {
              return null;
            } else if (
              station.STATN_NM.toLowerCase().includes(searchText.toLowerCase())
            ) {
              return station;
            }
          })
          .map(station => {
            return (
              <View>
                <SearchResult
                  setSearchText={setSearchText}
                  searchText={searchText}
                  result={station.STATN_NM}
                  getMetroData={getMetroData}
                  P0={P0}
                  setP0={setP0}
                />
              </View>
            );
          })}
      </SearchResults>
    )
  );
}

const SearchResults = styled.View`
  position: absolute;
  top: 40px;
  z-index: 1;
  background-color: #fff;
  width: 100%;
  padding: 10px;
`;
