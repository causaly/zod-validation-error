import * as zod from 'zod/v4';

import { fromZodIssue } from './fromZodIssue.ts';
import { ValidationError } from './ValidationError.ts';
import { isZodErrorLike } from './isZodErrorLike.ts';

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
});
