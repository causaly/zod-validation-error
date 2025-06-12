import { isValidationError } from './isValidationError.ts';
import { ValidationError } from './ValidationError.ts';

describe('isValidationError()', () => {
  test('returns true when argument is instance of ValidationError', () => {
    expect(isValidationError(new ValidationError('foobar'))).toEqual(true);
  });

  test('returns false when argument is plain Error', () => {
    expect(isValidationError(new Error('foobar'))).toEqual(false);
  });

  test.each(['foobar', 123, { message: 'foobar' }])(
    'returns false when argument is %s',
    (input) => {
      expect(isValidationError(input)).toEqual(false);
    }
  );
});
