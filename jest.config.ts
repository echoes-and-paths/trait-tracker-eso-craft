export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': { useESM: true, tsconfig: 'tsconfig.app.json' },
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
