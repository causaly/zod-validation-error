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
      const schema = zod.object({
        input: zod.email(),
      });
      const result = schema.safeParse({ input: 'coyote@acme' });
      if (result.success) throw new Error('Expected failure');

      const message = 'Invalid email coyote@acme';
      const err = new ValidationError(message, {
        cause: result.error,
      });

      expect(err.message).toBe(message);
      // @ts-ignore
      expect(err.cause).toEqual(result.error);
      expect(err.details).toEqual(result.error.issues);
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
