import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import stylex from '@stylexjs/eslint-plugin';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    plugins: { '@stylexjs': stylex },
    rules: {
      '@stylexjs/valid-styles': 'error',
      '@stylexjs/no-unused': 'error',
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: ['babel.config.js', 'postcss.config.js', 'next.config.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  globalIgnores(['.next*/**', '.template/**', 'runtime/**', 'out/**', 'build.log', 'build-final.log', 'dev.log', 'check.log']),
]);
