// Button.test.js

import React from 'react';
import {shallow} from 'enzyme';
import Button from './Button';

describe('Button Component', () => {
  it('renders button with correct title and style', () => {
    const onDisplayNotificationMock = jest.fn();
    const wrapper = shallow(
      <Button
        onPress={onDisplayNotificationMock}
        title="알림 설정"
        buttonStyle="primary"
      />,
    );

    // Assert the button title
    expect(wrapper.text()).toEqual('알림 설정');

    // Assert the button style
    expect(wrapper.hasClass('primary')).toBe(true);

    // Simulate button click
    wrapper.simulate('click');

    // Assert the onPress function
    expect(onDisplayNotificationMock).toHaveBeenCalled();
  });
});
