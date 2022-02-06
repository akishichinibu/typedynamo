/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// const { pathsToModuleNameMapper } = require('ts-jest/utils');
// const { compilerOptions } = require('./tsconfig');

module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src(.*)': '<rootDir>/src/$1',
  },
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths /*, { prefix: '<rootDir>/' } */ ),
  transformIgnorePatterns: ['node_modules', 'dist', '.yalc'],
  testPathIgnorePatterns: ['dist', '.yalc'],
};
