import { stringifyValue, stringifySymbol } from './stringify.ts';

describe('stringifySymbol()', () => {
  it('returns description for symbol with description', () => {
    expect(stringifySymbol(Symbol('desc'))).toBe('desc');
  });
  it('returns empty string for symbol without description', () => {
    expect(stringifySymbol(Symbol())).toBe('');
  });
});

describe('stringifyValue()', () => {
  it('stringifies string without quotes by default', () => {
    expect(stringifyValue('foo')).toBe('foo');
  });
  it('stringifies string with quotes if option set', () => {
    expect(stringifyValue('foo', { wrapStringsInQuote: true })).toBe('"foo"');
  });
  it('stringifies number', () => {
    expect(stringifyValue(1234)).toBe('1,234');
  });
  it('stringifies bigint', () => {
    expect(stringifyValue(BigInt(1234))).toBe('1,234');
  });
  it('stringifies symbol', () => {
    expect(stringifyValue(Symbol('bar'))).toBe('bar');
  });
  it('stringifies null', () => {
    expect(stringifyValue(null)).toBe('null');
  });
  it('stringifies undefined', () => {
    expect(stringifyValue(undefined)).toBe('undefined');
  });
  it('stringifies boolean', () => {
    expect(stringifyValue(true)).toBe('true');
    expect(stringifyValue(false)).toBe('false');
  });
});
