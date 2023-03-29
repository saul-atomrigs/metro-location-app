# Text

Text is a text component that standardizes on typography provided through theme via [@metamask/design-tokens](https://www.npmjs.com/package/@metamask/design-tokens) library.

본 컴포넌트는 @metamask/design-tokens 라이브러리를 통해 제공되는 테마를 통해 표준화된 텍스트를 제공합니다.

## Props

This component extends [TextProps](https://reactnative.dev/docs/text-style-props) from React Native's [Text](https://reactnative.dev/docs/text) component.

본 컴포넌트는 React Native Text 컴포넌트의 TextProps를 확장합니다.

### `variant`

Optional enum to select between Typography variants.

여러 Typography variant 중 하나를 선택할 수 있습니다.

| <span style="color:gray;font-size:14px">TYPE</span> | <span style="color:gray;font-size:14px">REQUIRED</span> | <span style="color:gray;font-size:14px">DEFAULT</span> |
| :-------------------------------------------------- | :------------------------------------------------------ | :----------------------------------------------------- |
| [TextVariant](./Text.types.ts#L6)                   | No                                                      | BodyMD                                                 |

## Usage

```javascript
import Text, {TextVariant} from 'app/component-library/Text';

<Text variant={TextVariant.HeadingSM}>{TEXT_LABEL}</Text>;
```
