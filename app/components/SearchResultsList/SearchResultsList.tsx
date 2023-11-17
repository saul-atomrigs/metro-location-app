import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';

import SearchResult from 'components/SearchResult/SearchResult';
import {MetroRowData} from 'screens/Home/Home.types';

type SearchResultsListProps = {
  metroData: MetroRowData[];
  searchText: string;
  setSearchText: (text: string) => void;
  getMetroData: (searchTerm: string) => Promise<void>;
  searchMetroCoords: {latitude: number; longitude: number};
  setSearchMetroCoords: (coords: {latitude: number; longitude: number}) => void;
};

export default function SearchResultsList({
  metroData,
  searchText,
  setSearchText,
  getMetroData,
  searchMetroCoords,
  setSearchMetroCoords,
}: SearchResultsListProps) {
  console.log('searchMetroCoords --', searchMetroCoords);
  return (
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
                result={station.STATN_NM}
                metroLine={station.ROUTE}
                setSearchText={setSearchText}
                getMetroData={getMetroData}

                // searchText={searchText}
                // searchMetroCoords={searchMetroCoords}
                // setSearchMetroCoords={setSearchMetroCoords}
              />
            </View>
          );
        })}
    </SearchResults>
  );
}

const SearchResults = styled.View`
  position: absolute;
  z-index: 1;
  background-color: #fff;
  border-radius: 13px;
  width: 90%;
`;
