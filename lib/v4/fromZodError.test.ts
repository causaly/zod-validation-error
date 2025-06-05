import * as zod from 'zod/v4';

import { fromZodError } from './fromZodError.ts';
import { ValidationError } from './ValidationError.ts';
import { isZodErrorLike } from './isZodErrorLike.ts';
import { createErrorMap } from './errorMap/errorMap.ts';

describe('fromZodError()', () => {
  test('handles ZodError', () => {
    const schema = zod.email();

    try {
      schema.parse('foobar');
    } catch (err) {
      if (isZodErrorLike(err)) {
        const validationError = fromZodError(err);
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Invalid email address"`
        );
        expect(validationError.details).toMatchInlineSnapshot(`
          [
            {
              "code": "invalid_format",
              "format": "email",
              "message": "Invalid email address",
              "origin": "string",
              "path": [],
              "pattern": "/^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$/",
            },
          ]
        `);
      }
    }
  });

  test('accepts custom errorMap as option', () => {
    const schema = zod.email();

    try {
      schema.parse('foobar');
    } catch (err) {
      if (isZodErrorLike(err)) {
        const errorMap = createErrorMap({
          includePath: true,
        });
        const validationError = fromZodError(err, {
          error: errorMap,
        });
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Invalid email"`
        );
        expect(validationError.details).toMatchInlineSnapshot(`
          [
            {
              "code": "invalid_format",
              "format": "email",
              "message": "Invalid email address",
              "origin": "string",
              "path": [],
              "pattern": "/^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$/",
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
