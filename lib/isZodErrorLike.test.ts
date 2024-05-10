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

  test('returns false when argument resembles a ZodError but does not have issues', () => {
    const err = new CustomZodError('foobar');
    // @ts-expect-error
    err.issues = undefined;

    expect(isZodErrorLike(err)).toEqual(false);
  });

  test('returns false when argument resembles a ZodError but has the wrong name', () => {
    const err = new CustomZodError('foobar');
    err.name = 'foobar';

    expect(isZodErrorLike(err)).toEqual(false);
  });

  test('returns false when argument is generic Error', () => {
    const err = new Error('foobar');

    expect(isZodErrorLike(err)).toEqual(false);
  });

  test('returns false when argument is string', () => {
    const err = 'error message';

    expect(isZodErrorLike(err)).toEqual(false);
  });

  test('returns false when argument is number', () => {
    const err = 123;

    expect(isZodErrorLike(err)).toEqual(false);
  });

  test('returns false when argument is object', () => {
    const err = {};

    expect(isZodErrorLike(err)).toEqual(false);
  });

  test('returns false when argument is object, even if it carries the same props as an actual ZodError', () => {
    const err = {
      name: 'ZodError',
      issues: [],
    };

    expect(isZodErrorLike(err)).toEqual(false);
  });
});
