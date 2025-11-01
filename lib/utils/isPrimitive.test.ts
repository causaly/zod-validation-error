import { describe, it, expect } from 'vitest';
import { isPrimitive } from './isPrimitive.ts';

describe('isPrimitive', () => {
  it('returns true for string', () => {
    expect(isPrimitive('hello')).toBe(true);
  });

  it('returns true for number', () => {
    expect(isPrimitive(42)).toBe(true);
    expect(isPrimitive(-1)).toBe(true);
    expect(isPrimitive(0)).toBe(true);
    expect(isPrimitive(NaN)).toBe(true);
    expect(isPrimitive(Infinity)).toBe(true);
  });

  it('returns true for boolean', () => {
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
  });

  it('returns true for null', () => {
    expect(isPrimitive(null)).toBe(true);
  });

  it('returns true for undefined', () => {
    expect(isPrimitive(undefined)).toBe(true);
  });

  it('returns true for symbol', () => {
    expect(isPrimitive(Symbol('sym'))).toBe(true);
  });

  it('returns true for bigint', () => {
    expect(isPrimitive(BigInt(123))).toBe(true);
  });

  it('returns false for object', () => {
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive(new Date())).toBe(false);
    expect(isPrimitive(/regex/)).toBe(false);
  });

  it('returns false for function', () => {
    expect(isPrimitive(function () {})).toBe(false);
    expect(isPrimitive(() => {})).toBe(false);
  });

  it('returns false for class instance', () => {
    class Foo {}
    expect(isPrimitive(new Foo())).toBe(false);
  });

  it('returns false for wrapper objects', () => {
    expect(isPrimitive(new String('abc'))).toBe(false);
    expect(isPrimitive(new Number(123))).toBe(false);
    expect(isPrimitive(new Boolean(true))).toBe(false);
  });
});
