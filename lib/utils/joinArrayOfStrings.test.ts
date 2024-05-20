import { joinArrayOfStrings } from './joinArrayOfStrings.ts';

describe('joinArrayOfStrings()', () => {
  test('handles empty array of string', () => {
    expect(joinArrayOfStrings([])).toEqual('');
  });

  test('handles single string in array', () => {
    expect(joinArrayOfStrings(['a'])).toEqual('a');
  });

  test('handles array of two strings', () => {
    expect(joinArrayOfStrings(['a', 'b'])).toEqual('a and b');
  });

  test('handles array of multiple strings', () => {
    expect(joinArrayOfStrings(['a', 'b', 'c'])).toEqual('a, b and c');
  });

  test('accepts options', () => {
    expect(
      joinArrayOfStrings(['a', 'b', 'c'], {
        separator: ' | ',
        lastSeparator: ' or ',
      })
    ).toEqual('a | b or c');
  });
});
