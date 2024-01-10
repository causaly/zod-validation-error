import * as zod from 'zod';

import { ValidationError } from './ValidationError';

describe('ValidationError', () => {
  describe('constructor', () => {
    test('accepts message', () => {
      const message = 'Invalid email coyote@acme';

      const err = new ValidationError(message);
      expect(err.message).toBe(message);
      expect(err.issues).toEqual([]);
    });

    test('accepts message with cause', () => {
      const message = 'Invalid email coyote@acme';

      const err = new ValidationError(message, {
        cause: new Error('foobar'),
      });
      expect(err.message).toBe(message);
      expect(err.issues).toEqual([]);
    });

    test('accepts ZodError as cause', () => {
      const message = 'Invalid email coyote@acme';
      const issues: Array<zod.ZodIssue> = [
        {
          code: 'invalid_string',
          message: 'Invalid email',
          path: [],
          validation: 'email',
        },
      ];

      const err = new ValidationError(message, {
        cause: new zod.ZodError(issues),
      });
      expect(err.message).toBe(message);
      expect(err.issues).toEqual(issues);
    });
  });

  describe('toString()', () => {
    test('converts error to string', () => {
      const error = new ValidationError('Invalid email coyote@acme');
      expect(error.toString()).toMatchInlineSnapshot(
        `"Invalid email coyote@acme"`
      );
    });
  });
});
