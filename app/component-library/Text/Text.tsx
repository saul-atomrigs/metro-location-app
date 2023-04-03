import React from 'react';

// import {useStyles} from 'hooks/useStyles';

// import styleSheet from './Text.styles';
import {DEFAULT_TEXT_COLOR, DEFAULT_TEXT_VARIANT} from './Text.constants';
import {StyledText} from './Text.styles';

export default function CustomText({
  variant = DEFAULT_TEXT_VARIANT,
  color = DEFAULT_TEXT_COLOR,
  // style,
  children,
  ...props
}) {
  // const {styles} = useStyles(styleSheet, {variant, style, color});
  return <StyledText {...props}>{children}</StyledText>;
}
