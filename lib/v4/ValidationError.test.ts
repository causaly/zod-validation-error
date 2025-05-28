import * as zod from 'zod/v4';
import { ValidationError } from './ValidationError.ts';

describe('ValidationError', () => {
  describe('constructor', () => {
    test('accepts message', () => {
      const message = 'Invalid email coyote@acme';

      const err = new ValidationError(message);
      expect(err.message).toBe(message);
      // @ts-ignore
      expect(err.cause).toBeUndefined();
      expect(err.details).toEqual([]);
    });

    test('accepts message with cause', () => {
      const message = 'Invalid email coyote@acme';
      const cause = new Error('foobar');

      const err = new ValidationError(message, { cause });
      expect(err.message).toBe(message);
      // @ts-ignore
      expect(err.cause).toEqual(cause);
      expect(err.details).toEqual([]);
    });

    test('accepts ZodError as cause', () => {
      const message = 'Invalid email coyote@acme';
      const issues: Array<zod.core.$ZodIssue> = [
        {
          code: 'invalid_format',
          message: 'Invalid email',
          path: [],
          format: 'email',
          input: 'coyote@acme',
        },
      ];
      const cause = new zod.core.$ZodError(issues);

      const err = new ValidationError(message, {
        cause,
      });
      expect(err.message).toBe(message);
      // @ts-ignore
      expect(err.cause).toEqual(cause);
      expect(err.details).toEqual(issues);
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
