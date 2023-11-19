// SearchBar.test.js

import React from 'react';
import {shallow} from 'enzyme';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  it('renders SearchBar component with correct props', () => {
    const searchText = 'New York';
    const setSearchTextMock = jest.fn();
    const debouncedGetMetroDataMock = jest.fn();
    const metroData = [
      {
        /* sample metro data */
      },
    ];
    const getMetroDataMock = jest.fn();

    const wrapper = shallow(
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchTextMock}
        debouncedGetMetroData={debouncedGetMetroDataMock}
        metroData={metroData}
        getMetroData={getMetroDataMock}
      />,
    );

    // Assert the input value
    expect(wrapper.find('input').prop('value')).toEqual(searchText);

    // Simulate a change event on the input
    wrapper.find('input').simulate('change', {target: {value: 'Los Angeles'}});

    // Assert that setSearchTextMock has been called
    expect(setSearchTextMock).toHaveBeenCalledWith('Los Angeles');

    // Simulate a click event on the search button
    wrapper.find('button').simulate('click');

    // Assert that debouncedGetMetroDataMock has been called with the correct arguments
    expect(debouncedGetMetroDataMock).toHaveBeenCalledWith(searchText);

    // You can add more assertions based on your specific implementation and requirements
  });
});
