import { joinValues } from './joinValues.ts';

describe('joinValues()', () => {
  it('joins values with separator', () => {
    expect(joinValues([1, 2, 3], { separator: ', ' })).toBe('1, 2, 3');
  });

  it('uses lastSeparator for last value', () => {
    expect(
      joinValues([1, 2, 3], { separator: ', ', lastSeparator: ' and ' })
    ).toBe('1, 2 and 3');
  });

  it('wraps strings in quotes if option is set', () => {
    expect(
      joinValues(['a', 'b', 'c'], { separator: ', ', wrapStringsInQuote: true })
    ).toBe('"a", "b", "c"');
  });

  it('limits number of values displayed with maxValuesToDisplay', () => {
    expect(
      joinValues([1, 2, 3, 4], {
        separator: ', ',
        lastSeparator: ' or ',
        maxValuesToDisplay: 2,
      })
    ).toBe('1, 2 or 2 more value(s)');
  });

  it('handles empty array', () => {
    expect(joinValues([], { separator: ', ' })).toBe('');
  });

  it('handles single value', () => {
    expect(joinValues([42], { separator: ', ' })).toBe('42');
  });

  it('handles mix of types', () => {
    expect(
      joinValues([1, 'a', true, null, Symbol('symbol')], { separator: '|' })
    ).toBe('1|a|true|null|symbol');
  });

  it('accepts multiple options', () => {
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
