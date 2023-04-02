/**
 * Common styles and variables
 */

import {TextStyle, ViewStyle} from 'react-native';

/**
 * Map of color names to HEX values
 */
export const colors = {
  black: '#24292E',
  blackTransparent: 'rgba(0, 0, 0, 0.5)',
  white: '#FFFFFF',
  whiteTransparent: 'rgba(255, 255, 255, 0.7)',
  yellow: '#FFD33D',
  transparent: 'transparent',
  shadow: '#6a737d',
};

/**
 * Map of reusable base styles
 */
export const baseStyles: Record<string, ViewStyle> = {
  flexGrow: {
    flex: 1,
  },
  flexStatic: {
    flex: 0,
  },
};

/**
 * Map of reusable fonts
 */
export const fontStyles: Record<string, TextStyle> = {
  normal: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
  },
  light: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '300',
    fontSize: 16,
  },
  thin: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '100',
    fontSize: 16,
  },
  bold: {
    fontFamily: 'Roboto-Bold',
    fontWeight: '600',
    fontSize: 16,
  },
};
