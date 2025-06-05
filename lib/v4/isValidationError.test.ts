import { isValidationError } from './isValidationError.ts';
import { ValidationError } from './ValidationError.ts';

describe('isValidationError()', () => {
  test('returns true when argument is instance of ValidationError', () => {
    expect(isValidationError(new ValidationError('foobar'))).toEqual(true);
  });

  test('returns false when argument is plain Error', () => {
    expect(isValidationError(new Error('foobar'))).toEqual(false);
  });

  test('returns false when argument is not an Error', () => {
    expect(isValidationError('foobar')).toEqual(false);
    expect(isValidationError(123)).toEqual(false);
    expect(
      isValidationError({
        message: 'foobar',
      })
    ).toEqual(false);
  });
});
