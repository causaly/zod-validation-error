import { isValidationErrorLike } from './isValidationErrorLike.ts';
import { ValidationError } from './ValidationError.ts';

describe('isValidationErrorLike()', () => {
  test('returns true when argument is an actual instance of ValidationError', () => {
    expect(isValidationErrorLike(new ValidationError('foobar'))).toEqual(true);
  });

  test('returns true when argument resembles a ValidationError', () => {
    const err = new ValidationError('foobar');
    expect(isValidationErrorLike(err)).toEqual(true);
  });

  test('returns false when argument is generic Error', () => {
    expect(isValidationErrorLike(new Error('foobar'))).toEqual(false);
  });

  test.each(['foobar', 123, { message: 'foobar' }])(
    'returns false when argument is %s',
    (input) => {
      expect(isValidationErrorLike(input)).toEqual(false);
    }
  );
});
