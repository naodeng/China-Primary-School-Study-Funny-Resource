import { Radio } from 'animal-island-ui';
import type { ThemePreference } from '../../theme/ThemeProvider';
import { useTheme } from '../../theme/ThemeProvider';

const options = [
  { label: '跟随系统', value: 'system' },
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
];

export default function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();

  return (
    <fieldset className="theme-switcher">
      <legend>主题选项</legend>
      <Radio
        className="theme-switcher-options"
        size="middle"
        value={preference}
        options={options}
        onChange={(value) => {
          if (value === 'system' || value === 'light' || value === 'dark') setPreference(value as ThemePreference);
        }}
      />
    </fieldset>
  );
}
