# Search Results List Component

## Overview

The Search Results List component is designed to display and present search results based on Metro data. It complements the Search Bar component, allowing users to view and interact with the filtered Metro data.

## Usage

```jsx
import React from 'react';
import SearchResultsList from '@components/search-results';

// ...

const YourComponent = () => {
  const handleSearchTextChange = (text) => {
    // handle the search text change
  };

  const handleGetMetroData = async (text) => {
    // handle getting Metro data
  };

  return (
    <div>
      <SearchResultsList
        metroData={/* pass your Metro data array here */}
        searchText={/* pass your search text here */}
        setSearchText={handleSearchTextChange}
        getMetroData={handleGetMetroData}
      />
    </div>
  );
};

export default YourComponent;
```

## Props

- `metroData` (array): An array of Metro data to be displayed or filtered.
- `searchText` (string): The current search text.
- `setSearchText` (function): A function to set the search text.
- `getMetroData` (function): A function to get Metro data. This function should return a Promise.
