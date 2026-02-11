import { Platform } from 'react-native';

const theme = {
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    primary: '#0366d6',
    background: '#e1e4e8',
    white: '#ffffff',
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main:
      Platform.OS === 'android'
        ? 'Roboto'
        : Platform.OS === 'ios'
        ? 'Arial'
        : 'System',
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
};

export default theme;
