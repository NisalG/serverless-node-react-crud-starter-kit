module.exports = {
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@functions/(.*)$': '<rootDir>/src/functions/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@data/(.*)$': '<rootDir>src/data/$1',
  },

  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
};
