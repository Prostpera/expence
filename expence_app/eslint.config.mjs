import nextConfig from 'eslint-config-next';

const config = [
  // Base Next.js flat config (includes TS support)
  ...nextConfig,
  // Project-specific rule tweaks
  {
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/immutability': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/google-font-display': 'off',
      '@next/next/no-page-custom-font': 'off',
      'no-console': 'off',
    },
  },
  // Jest globals for test files
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    languageOptions: {
      globals: {
        jest: true,
      },
    },
  },
];

export default config;
