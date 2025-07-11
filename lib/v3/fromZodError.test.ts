import * as zod from 'zod/v3';
import { ZodError } from 'zod/v3';

import { fromZodError } from './fromZodError.ts';
import { ValidationError } from './ValidationError.ts';

describe('fromZodError()', () => {
  test('handles ZodError', () => {
    const schema = zod.string().email();

    try {
      schema.parse('foobar');
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Invalid email"`
        );
        expect(validationError.details).toMatchInlineSnapshot(`
            [
              {
                "code": "invalid_string",
                "message": "Invalid email",
                "path": [],
                "validation": "email",
              },
            ]
        `);
      }
    }
  });

  test('throws a dev-friendly TypeError on invalid input', () => {
    const input = new Error("I wish I was a ZodError, but I'm not");

    try {
      // @ts-expect-error
      fromZodError(input);
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
      // @ts-expect-error
      expect(err.message).toMatchInlineSnapshot(
        `"Invalid zodError param; expected instance of ZodError. Did you mean to use the "fromError" method instead?"`
      );
    }
  });
});
