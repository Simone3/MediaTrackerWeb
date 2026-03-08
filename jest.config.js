module.exports = {
  testEnvironment: 'jsdom',
  roots: [ '<rootDir>/app', '<rootDir>/tests' ],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/app/$1',
    '\\.(css)$': '<rootDir>/tests/style-mock.js',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/tests/file-mock.js'
  },
  setupFilesAfterEnv: [ '<rootDir>/tests/setup-tests.ts' ],
  testPathIgnorePatterns: [ '/node_modules/', '/android/', '/ios/' ]
};
