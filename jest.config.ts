import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.mjs$': 'babel-jest',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(ts|js)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1', // pour .mjs/.js import ESM
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$)|(@ionic|@stencil/core|@capacitor|@ionic-native|@awesome-cordova-plugins)/)'
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
      useESM: true,
    },
  },
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageReporters: ['html', 'text', 'lcov'],
};

export default config;
