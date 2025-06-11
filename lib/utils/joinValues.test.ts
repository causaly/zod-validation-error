import { joinValues } from './joinValues.ts';

describe('joinValues()', () => {
  test('joins values with separator', () => {
    expect(joinValues([1, 2, 3], { separator: ', ' })).toBe('1, 2, 3');
  });

  test('uses lastSeparator for last value', () => {
    expect(
      joinValues([1, 2, 3], { separator: ', ', lastSeparator: ' and ' })
    ).toBe('1, 2 and 3');
  });

  test('wraps strings in quotes if option is set', () => {
    expect(
      joinValues(['a', 'b', 'c'], { separator: ', ', wrapStringsInQuote: true })
    ).toBe('"a", "b", "c"');
  });

  test('limits number of values displayed with maxValuesToDisplay', () => {
    expect(
      joinValues([1, 2, 3, 4], {
        separator: ', ',
        lastSeparator: ' or ',
        maxValuesToDisplay: 2,
      })
    ).toBe('1, 2 or 2 more value(s)');
  });

  test('handles empty array', () => {
    expect(joinValues([], { separator: ', ' })).toBe('');
  });

  test('handles single value', () => {
    expect(joinValues([42], { separator: ', ' })).toBe('42');
  });

  test('handles mix of types', () => {
    expect(
      joinValues([1, 'a', true, null, Symbol('symbol')], { separator: '|' })
    ).toBe('1|a|true|null|symbol');
  });

  test('accepts multiple options', () => {
    expect(
      joinValues(['a', 'b', 'c', 'd', 'e'], {
        separator: ', ',
        lastSeparator: ' or ',
        maxValuesToDisplay: 3,
        wrapStringsInQuote: true,
      })
    ).toBe('"a", "b", "c" or 2 more value(s)');
  });
});
