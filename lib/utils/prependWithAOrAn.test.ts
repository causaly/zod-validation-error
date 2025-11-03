import { describe, it, expect } from 'vitest';
import { prependWithAOrAn } from './prependWithAOrAn.ts';

describe('prependWithAOrAn', () => {
  it('prepends "an" for words starting with a vowel', () => {
    expect(prependWithAOrAn('apple')).toBe('an apple');
    expect(prependWithAOrAn('orange')).toBe('an orange');
    expect(prependWithAOrAn('umbrella')).toBe('an umbrella');
    expect(prependWithAOrAn('elephant')).toBe('an elephant');
    expect(prependWithAOrAn('ice')).toBe('an ice');
  });

  it('prepends "an" for words starting with "h"', () => {
    expect(prependWithAOrAn('hour')).toBe('an hour');
    expect(prependWithAOrAn('honor')).toBe('an honor');
    expect(prependWithAOrAn('heirloom')).toBe('an heirloom');
  });

  it('prepends "a" for words starting with consonants', () => {
    expect(prependWithAOrAn('banana')).toBe('a banana');
    expect(prependWithAOrAn('car')).toBe('a car');
    expect(prependWithAOrAn('dog')).toBe('a dog');
    expect(prependWithAOrAn('fox')).toBe('a fox');
    expect(prependWithAOrAn('zebra')).toBe('a zebra');
  });

  it('handles uppercase input', () => {
    expect(prependWithAOrAn('Apple')).toBe('an Apple');
    expect(prependWithAOrAn('Banana')).toBe('a Banana');
    expect(prependWithAOrAn('Hour')).toBe('an Hour');
  });

  it('handles empty string', () => {
    expect(prependWithAOrAn('')).toBe('a ');
  });

  it('handles single letter words', () => {
    expect(prependWithAOrAn('a')).toBe('an a');
    expect(prependWithAOrAn('b')).toBe('a b');
    expect(prependWithAOrAn('h')).toBe('an h');
  });

  it('handles non-alphabetic characters', () => {
    expect(prependWithAOrAn('1apple')).toBe('a 1apple');
    expect(prependWithAOrAn('!exclamation')).toBe('a !exclamation');
  });
});
