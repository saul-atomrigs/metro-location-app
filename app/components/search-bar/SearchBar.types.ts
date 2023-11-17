export type SearchBarProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  debouncedGetMetroData: (text: string) => void;
};
