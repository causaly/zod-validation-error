import { stringify, stringifySymbol } from './stringify.ts';

describe('stringifySymbol()', () => {
  test('returns description for symbol with description', () => {
    expect(stringifySymbol(Symbol('desc'))).toBe('desc');
  });
  test('returns empty string for symbol without description', () => {
    expect(stringifySymbol(Symbol())).toBe('');
  });
});

describe('stringify()', () => {
  test('stringifies string', () => {
    expect(stringify('foo')).toBe('foo');
  });

  test('stringifies string with quotes', () => {
    expect(stringify('foo', { wrapStringValueInQuote: true })).toBe('"foo"');
  });

  test('stringifies number', () => {
    expect(stringify(1234)).toBe('1,234');
  });

  test('stringifies number without localization', () => {
    expect(
      stringify(1234, {
        localization: false,
      })
    ).toBe('1234');
  });

  test('stringifies number with explicit locale', () => {
    expect(
      stringify(1234, {
        localization: 'ar-EG',
      })
    ).toBe('١٬٢٣٤');
  });

  test('stringifies bigint', () => {
    expect(stringify(BigInt(1234))).toBe('1,234');
  });

  test('stringifies bigint without localization', () => {
    expect(
      stringify(BigInt(1234), {
        localization: false,
      })
    ).toBe('1234');
  });

  test('stringifies bigint with explicit locale', () => {
    expect(
      stringify(BigInt(1234), {
        localization: 'ar-EG',
      })
    ).toBe('١٬٢٣٤');
  });

  test('stringifies symbol', () => {
    expect(stringify(Symbol('bar'))).toBe('bar');
  });

  test('stringifies null', () => {
    expect(stringify(null)).toBe('null');
  });

  test('stringifies undefined', () => {
    expect(stringify(undefined)).toBe('undefined');
  });

  test('stringifies boolean', () => {
    expect(stringify(true)).toBe('true');
    expect(stringify(false)).toBe('false');
  });

  test('stringifies date', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    expect(stringify(date)).toBe(date.toLocaleString());
  });

  test('stringifies date without localization', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    expect(
      stringify(date, {
        localization: false,
      })
    ).toBe(date.toISOString());
  });

  test('stringifies date with explicit locale', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    expect(
      stringify(date, {
        localization: 'ar-EG',
      })
    ).toBe(date.toLocaleString('ar-EG'));
  });
});
