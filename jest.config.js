module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: ['lib/**/*.{js,ts}'],
  testRegex: './lib/.*\\.(test|spec)\\.(js|ts)$',
  /**
   * @see https://jestjs.io/docs/configuration/#prettierpath-string
   */
  prettierPath: require.resolve('prettier-2'),
};
