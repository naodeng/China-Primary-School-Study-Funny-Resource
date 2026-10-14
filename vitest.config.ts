import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    server: {
      deps: {
        inline: ['animal-island-ui'],
      },
    },
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/vite-env.d.ts'],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
        'src/app/router.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/content/curriculum.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/content/validateCurriculum.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/learning/answers.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/learning/matching.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/learning/feedback.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/learning/session.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/storage/progress.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/achievements/position.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/achievements/progress.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/achievements/exploration.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/theme/themePreferences.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/sound/soundPreferences.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
        'src/sound/soundCues.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
      },
    },
  },
}));
