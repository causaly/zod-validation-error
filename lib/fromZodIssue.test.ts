import * as zod from 'zod';

import { fromZodIssue } from './fromZodIssue';
import { ValidationError } from './ValidationError';

describe('fromZodIssue()', () => {
  test('handles zod.string() schema errors', () => {
    const schema = zod.string().email();

    try {
      schema.parse('foobar');
    } catch (err) {
      if (err instanceof zod.ZodError) {
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

  test('respects `includePath` prop when set to `false`', () => {
    const schema = zod.object({
      name: zod.string().min(3, '"Name" must be at least 3 characters'),
    });

    try {
      schema.parse({ name: 'jo' });
    } catch (err) {
      if (err instanceof zod.ZodError) {
        const validationError = fromZodIssue(err.issues[0], {
          includePath: false,
        });
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: "Name" must be at least 3 characters"`
        );
      }
    }
  });
});
