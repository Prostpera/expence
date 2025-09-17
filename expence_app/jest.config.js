module.exports = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: './test-config/babel.config.jest.js' }],
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testMatch: [
  '**/__tests__/**/*.[jt]s?(x)',
  '**/?(*.)+(spec|test).[jt]s?(x)'
],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts'
  ],
};