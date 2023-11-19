# Button Component

The Button component is a reusable React component designed for creating interactive buttons with different styles. It accepts the following props:

## 사용법

```jsx
import React from 'react';
import {Button} from 'your-button-library';

const MyComponent = () => {
  return (
    <div>
      {/* Primary Button */}
      <Button
        title="Primary Button"
        onPress={() => handlePress()}
        buttonStyle="primary"
      />

      {/* Danger Button */}
      <Button
        title="Danger Button"
        onPress={() => handleDangerPress()}
        buttonStyle="danger"
      />
    </div>
  );
};
```

## Button Props

The Button component takes the following props:

- `title` (string): The text displayed on the button.
- `onPress` (() => void): The callback function to be executed when the button is pressed.
- `buttonStyle` ('primary' | 'danger'): The style of the button, either 'primary' for a primary action or 'danger' for a potentially destructive action.

## Example

```jsx
import React from 'react';
import {Button} from 'your-button-library';

const MyComponent = () => {
  const handlePress = () => {
    // Handle primary button press
  };

  const handleDangerPress = () => {
    // Handle danger button press
  };

  return (
    <div>
      <Button
        title="Primary Button"
        onPress={handlePress}
        buttonStyle="primary"
      />
      <Button
        title="Danger Button"
        onPress={handleDangerPress}
        buttonStyle="danger"
      />
    </div>
  );
};
```
