import * as zod from 'zod';

import { fromZodIssue } from './fromZodIssue.ts';
import { ValidationError } from './ValidationError.ts';
import { isZodErrorLike } from './isZodErrorLike.ts';

describe('fromZodIssue()', () => {
  test('handles ZodIssue', () => {
    const schema = zod.string().email();

    try {
      schema.parse('foobar');
    } catch (err) {
      if (isZodErrorLike(err)) {
        const validationError = fromZodIssue(err.issues[0]);
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
});
