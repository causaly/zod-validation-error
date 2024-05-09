import * as zod from 'zod';
import { isZodErrorLike } from './isZodErrorLike.ts';

class CustomZodError extends Error {
  issues: zod.ZodIssue[];

  constructor(message: string) {
    super(message);
    this.name = 'ZodError';
    this.issues = [];
  }
}

describe('isZodErrorLike()', () => {
  test('returns true when argument is an actual instance of ZodError', () => {
    const err = new zod.ZodError([
      {
        code: zod.ZodIssueCode.custom,
        path: [],
        message: 'foobar',
        fatal: true,
      },
    ]);

    expect(isZodErrorLike(err)).toEqual(true);
  });

  test('returns true when argument resembles a ZodError', () => {
    const err = new CustomZodError('foobar');

    expect(isZodErrorLike(err)).toEqual(true);
  });

  test('returns false when argument is generic Error', () => {
    expect(isZodErrorLike(new Error('foobar'))).toEqual(false);
  });

  test('returns false when argument is not an Error instance', () => {
    expect(isZodErrorLike('foobar')).toEqual(false);
    expect(isZodErrorLike(123)).toEqual(false);
    expect(
      isZodErrorLike({
        name: 'ZodError',
        issues: [],
      })
    ).toEqual(false);
  });
});
