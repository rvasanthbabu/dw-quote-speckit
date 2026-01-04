export default {
  transform: {},
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
  ],
  testMatch: [
    '**/tests/**/*.test.js',
  ],
  moduleFileExtensions: ['js', 'json'],
};
