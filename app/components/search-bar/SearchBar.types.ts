import type {MetroRowData} from 'screens/Home/Home.types';

export type SearchBarProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  debouncedGetMetroData: (text: string) => void;
  metroData: MetroRowData[];
  getMetroData: (text: string) => Promise<void>;
};
