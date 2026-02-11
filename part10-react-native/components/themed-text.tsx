import { Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export function ThemedText(
  props: TextProps & {
    lightColor?: string;
    darkColor?: string;
  }
) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    'text'
  );

  return <Text style={[{ color }, style]} {...otherProps} />;
}
