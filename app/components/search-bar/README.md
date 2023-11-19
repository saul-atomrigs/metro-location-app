# Search Bar Component

## Overview

The Search Bar component is a customizable and interactive input field designed for searching and filtering data. It is built to be easily integrated into web applications and provides a seamless user experience for searching through Metro data.

## 사용법

```jsx
import React from 'react';
import SearchBar from '@/components/search-bar';

// ...

const YourComponent = () => {
  const handleSearchTextChange = (text) => {
    // handle the search text change
  };

  const handleDebouncedSearch = (text) => {
    // handle the debounced search
  };

  const handleGetMetroData = async (text) => {
    // handle getting Metro data
  };

  return (
    <div>
      <SearchBar
        searchText={/* pass your search text here */}
        setSearchText={handleSearchTextChange}
        debouncedGetMetroData={handleDebouncedSearch}
        metroData={/* pass your Metro data array here */}
        getMetroData={handleGetMetroData}
      />
      {/* Your other components and UI elements */}
    </div>
  );
};

export default YourComponent;
```

## Props

The `SearchBar` component accepts the following props:

- `searchText` (string): The current search text.
- `setSearchText` (function): A function to set the search text.
- `debouncedGetMetroData` (function): A function to handle debounced search requests.
- `metroData` (array): An array of Metro data to be displayed or filtered.
- `getMetroData` (function): A function to get Metro data. This function should return a Promise.
