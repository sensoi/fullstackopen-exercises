import Colors from '@/constants/Colors';
import { useColorScheme } from './use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: 'text' | 'background' | 'tint'
) {
  const theme = useColorScheme() ?? 'light';

  const colorFromProps = props[theme];
  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}
