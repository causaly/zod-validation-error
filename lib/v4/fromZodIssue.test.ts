import * as zod from 'zod/v4';

import { fromZodIssue } from './fromZodIssue.ts';
import { ValidationError } from './ValidationError.ts';
import { isZodErrorLike } from './isZodErrorLike.ts';
import { createErrorMap } from './errorMap/errorMap.ts';

describe('fromZodIssue()', () => {
  test('handles ZodIssue', () => {
    const schema = zod.email();

    try {
      schema.parse('foobar');
    } catch (err) {
      if (isZodErrorLike(err)) {
        const validationError = fromZodIssue(err.issues[0]);
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
    const schema = zod.string().min(3);

    try {
      schema.parse('ab');
    } catch (err) {
      if (isZodErrorLike(err)) {
        const errorMap = createErrorMap({
          includePath: true,
        });
        const validationError = fromZodIssue(err.issues[0], {
          error: errorMap,
        });
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: String must contain at least 3 character(s)"`
        );
        expect(validationError.details).toMatchInlineSnapshot(`
          [
            {
              "code": "too_small",
              "inclusive": true,
              "message": "Too small: expected string to have >=3 characters",
              "minimum": 3,
              "origin": "string",
              "path": [],
            },
          ]
        `);
      }
    }
  });
});
