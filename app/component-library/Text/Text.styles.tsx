/** 외부 라이브러리 */
import {StyleSheet, TextStyle} from 'react-native';
import Styled from 'styled-components/native';

/** 내부 라이브러리 */
import {Theme} from 'util/theme/models';
import {colors, fontStyles} from 'styles/common';
import {TextColor} from 'component-library/Text/Text.types';

export const StyledText = Styled.Text`
  font-family: ${fontStyles.bold.fontFamily};
  font-size: ${fontStyles.bold.fontSize}px;
  color: ${colors.white};
`;

/**
 * Style sheet function for Text component.
 *
 * @param params Style sheet params.
 * @param params.theme App theme from ThemeContext.
 * @param params.vars Inputs that the style sheet depends on.
 * @returns StyleSheet object.
 */
const styleSheet = (params: {theme: Theme; vars: any}) => {
  const {theme, vars} = params;
  const {variant, style, color} = vars;

  let textColor;
  switch (color) {
    case TextColor.Default:
      textColor = theme.colors.text.default;
      break;
    case TextColor.Alternative:
      textColor = theme.colors.text.alternative;
      break;
    case TextColor.Muted:
      textColor = theme.colors.text.muted;
      break;
    case TextColor.Primary:
      textColor = theme.colors.primary.default;
      break;
    case TextColor.Success:
      textColor = theme.colors.success.default;
      break;
    case TextColor.Error:
      textColor = theme.colors.error.default;
      break;
    case TextColor.Warning:
      textColor = theme.colors.warning.default;
      break;
    case TextColor.Info:
      textColor = theme.colors.info.default;
      break;
    default:
      textColor = theme.colors.text.default;
  }

  return StyleSheet.create({
    base: Object.assign(
      {color: textColor},
      theme.typography[variant],
      style,
    ) as TextStyle,
  });
};

export default styleSheet;
