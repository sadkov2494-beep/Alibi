import { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  background: '#101827',
  backgroundSoft: '#172236',
  surface: '#1D2A3A',
  surfaceLight: '#25364A',
  primary: '#F7B731',
  primaryDark: '#D99920',
  secondary: '#7D5FFF',
  accent: '#FF6B6B',
  text: '#FFFFFF',
  mutedText: '#AAB4C0',
  success: '#4CD964',
  danger: '#FF3B30',
  warning: '#FFB020',
  line: '#34465E',
  mapRoute: '#FAD390',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const typography = {
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
  } satisfies TextStyle,
  h1: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
  } satisfies TextStyle,
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
  } satisfies TextStyle,
  body: {
    fontSize: 16,
    lineHeight: 22,
  } satisfies TextStyle,
  caption: {
    fontSize: 13,
    lineHeight: 18,
  } satisfies TextStyle,
};

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 5,
  } satisfies ViewStyle,
};
