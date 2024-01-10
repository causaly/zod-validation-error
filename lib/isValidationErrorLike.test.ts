import { isValidationErrorLike } from './isValidationErrorLike';
import { ValidationError } from './ValidationError';

describe('isValidationErrorLike()', () => {
  test('returns true when argument is an actual instance of ValidationError', () => {
    expect(isValidationErrorLike(new ValidationError('foobar'))).toEqual(true);
  });

  test('returns true when argument resembles a ValidationError', () => {
    const err = new Error('foobar');
    err.name = 'ZodValidationError'; // force ZodValidationError

    expect(isValidationErrorLike(err)).toEqual(true);
  });

  test('returns false when argument is generic Error', () => {
    expect(isValidationErrorLike(new Error('foobar'))).toEqual(false);
  });

  test('returns false when argument is not an Error instance', () => {
    expect(isValidationErrorLike('foobar')).toEqual(false);
    expect(isValidationErrorLike(123)).toEqual(false);
    expect(
      isValidationErrorLike({
        message: 'foobar',
      })
    ).toEqual(false);
  });
});
