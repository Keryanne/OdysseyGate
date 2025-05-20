module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testMatch: [
    "**/+(*.)+(spec).+(ts)?(x)"
  ],
  transform: {
    "^.+\\.(ts|js|html)$": "ts-jest"
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: 'coverage'
};
