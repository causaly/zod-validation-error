import * as zod from 'zod/v4';
import { isZodErrorLike } from './isZodErrorLike.ts';

class CustomZodError extends Error {
  issues: zod.core.$ZodIssue[];

  constructor(message: string) {
    super(message);
    this.name = 'ZodError';
    this.issues = [];
  }
}

describe('isZodErrorLike()', () => {
  test('returns true on parsing error', () => {
    const schema = zod.email();
    const response = schema.safeParse('foobar');

    if (response.success) {
      throw new Error('Expected to fail');
    }

    expect(isZodErrorLike(response.error)).toEqual(true);
  });

  test('returns true when argument is an instance of ZodError', () => {
    const error = new zod.ZodError([
      {
        origin: 'number',
        code: 'too_small',
        minimum: 0,
        inclusive: false,
        path: ['id'],
        message: 'Number must be greater than 0 at "id"',
        input: -1,
      },
    ]);
    expect(isZodErrorLike(error)).toEqual(true);
  });

  test('returns true when argument is an instance of ZodRealError', () => {
    const error = new zod.ZodRealError([]);
    expect(isZodErrorLike(error)).toEqual(true);
  });

  test('returns true when argument is an instance of $ZodError', () => {
    const error = new zod.core.$ZodError([]);
    expect(isZodErrorLike(error)).toEqual(true);
  });

  test('returns true when argument is an instance of $ZodRealError', () => {
    const error = new zod.core.$ZodRealError([]);
    expect(isZodErrorLike(error)).toEqual(true);
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
});
