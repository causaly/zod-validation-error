import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  rootDir: '..',
  testEnvironment: 'node',
  collectCoverageFrom: ['lib/**/*.{js,ts}'],
  testRegex: './lib/.*\\.(test|spec)\\.(js|ts)$',
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};

export default config;
