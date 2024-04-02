import * as zod from 'zod';

import { fromZodIssue } from './fromZodIssue.ts';
import { ValidationError } from './ValidationError.ts';

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

  test('handles zod.function() argument errors', () => {
    const fn = zod
      .function()
      .args(zod.number())
      .implement((num) => num * 2);

    try {
      // @ts-expect-error Intentionally wrong to exercise runtime checking
      fn('foo');
    } catch (err) {
      if (err instanceof zod.ZodError) {
        const validationError = fromZodIssue(err.issues[0]);
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Invalid function arguments; Expected number, received string at index 0"`
        );
        expect(validationError.details).toMatchInlineSnapshot(`
          [
            {
              "argumentsError": [ZodError: [
            {
              "code": "invalid_type",
              "expected": "number",
              "received": "string",
              "path": [
                0
              ],
              "message": "Expected number, received string"
            }
          ]],
              "code": "invalid_arguments",
              "message": "Invalid function arguments",
              "path": [],
            },
          ]
        `);
      }
    }
  });

  test('handles zod.function() return value errors', () => {
    const fn = zod
      .function()
      .returns(zod.number())
      // @ts-expect-error Intentionally wrong to exercise runtime checking
      .implement(() => 'foo');

    try {
      fn();
    } catch (err) {
      if (err instanceof zod.ZodError) {
        const validationError = fromZodIssue(err.issues[0]);
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Invalid function return type; Expected number, received string"`
        );
        expect(validationError.details).toMatchInlineSnapshot(`
          [
            {
              "code": "invalid_return_type",
              "message": "Invalid function return type",
              "path": [],
              "returnTypeError": [ZodError: [
            {
              "code": "invalid_type",
              "expected": "number",
              "received": "string",
              "path": [],
              "message": "Expected number, received string"
            }
          ]],
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
