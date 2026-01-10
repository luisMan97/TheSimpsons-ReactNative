import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'dark',
}));

describe('useThemeColor', () => {
  it('returns theme color when no override', () => {
    const color = useThemeColor({}, 'text');
    expect(color).toBe(Colors.dark.text);
  });
});
