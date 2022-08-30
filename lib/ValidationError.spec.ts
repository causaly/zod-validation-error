import * as zod from 'zod';

import {
  fromZodError,
  isValidationError,
  ValidationError,
} from './ValidationError';

describe('fromZodError()', () => {
  test('handles zod.string() schema errors', () => {
    const emailSchema = zod.string().email();

    try {
      emailSchema.parse('foobar');
    } catch (err) {
      const validationError = fromZodError(err);
      expect(validationError).toBeInstanceOf(ValidationError);
      expect(validationError.message).toMatchInlineSnapshot(
        `"Validation error: Invalid email"`
      );
      expect(validationError.details).toMatchInlineSnapshot(`
        Array [
          Object {
            "code": "invalid_string",
            "message": "Invalid email",
            "path": Array [],
            "validation": "email",
          },
        ]
      `);
    }
  });

  test('handles zod.object() schema errors', () => {
    const objSchema = zod.object({
      id: zod.number().int().positive(),
      name: zod.string().min(2),
    });

    try {
      objSchema.parse({
        id: -1,
        name: 'a',
      });
    } catch (err) {
      const validationError = fromZodError(err);
      expect(validationError).toBeInstanceOf(ValidationError);
      expect(validationError.message).toMatchInlineSnapshot(
        `"Validation error: Number must be greater than 0 at \\"id\\"; String must contain at least 2 character(s) at \\"name\\""`
      );
      expect(validationError.details).toMatchInlineSnapshot(`
        Array [
          Object {
            "code": "too_small",
            "inclusive": false,
            "message": "Number must be greater than 0",
            "minimum": 0,
            "path": Array [
              "id",
            ],
            "type": "number",
          },
          Object {
            "code": "too_small",
            "inclusive": true,
            "message": "String must contain at least 2 character(s)",
            "minimum": 2,
            "path": Array [
              "name",
            ],
            "type": "string",
          },
        ]
      `);
    }
  });

  test('handles zod.array() schema errors', () => {
    const objSchema = zod.array(zod.number().int());

    try {
      objSchema.parse([1, 'a', true, 1.23]);
    } catch (err) {
      const validationError = fromZodError(err);
      expect(validationError).toBeInstanceOf(ValidationError);
      expect(validationError.message).toMatchInlineSnapshot(
        `"Validation error: Expected number, received string at \\"[1]\\"; Expected number, received boolean at \\"[2]\\"; Expected integer, received float at \\"[3]\\""`
      );
      expect(validationError.details).toMatchInlineSnapshot(`
        Array [
          Object {
            "code": "invalid_type",
            "expected": "number",
            "message": "Expected number, received string",
            "path": Array [
              1,
            ],
            "received": "string",
          },
          Object {
            "code": "invalid_type",
            "expected": "number",
            "message": "Expected number, received boolean",
            "path": Array [
              2,
            ],
            "received": "boolean",
          },
          Object {
            "code": "invalid_type",
            "expected": "integer",
            "message": "Expected integer, received float",
            "path": Array [
              3,
            ],
            "received": "float",
          },
        ]
      `);
    }
  });

  test('handles nested zod.object() schema errors', () => {
    const objSchema = zod.object({
      id: zod.number().int().positive(),
      arr: zod.array(zod.number().int()),
      nestedObj: zod.object({
        name: zod.string().min(2),
      }),
    });

    try {
      objSchema.parse({
        id: -1,
        arr: [1, 'a'],
        nestedObj: {
          name: 'a',
        },
      });
    } catch (err) {
      const validationError = fromZodError(err);
      expect(validationError).toBeInstanceOf(ValidationError);
      expect(validationError.message).toMatchInlineSnapshot(
        `"Validation error: Number must be greater than 0 at \\"id\\"; Expected number, received string at \\"arr[1]\\"; String must contain at least 2 character(s) at \\"nestedObj.name\\""`
      );
      expect(validationError.details).toMatchInlineSnapshot(`
        Array [
          Object {
            "code": "too_small",
            "inclusive": false,
            "message": "Number must be greater than 0",
            "minimum": 0,
            "path": Array [
              "id",
            ],
            "type": "number",
          },
          Object {
            "code": "invalid_type",
            "expected": "number",
            "message": "Expected number, received string",
            "path": Array [
              "arr",
              1,
            ],
            "received": "string",
          },
          Object {
            "code": "too_small",
            "inclusive": true,
            "message": "String must contain at least 2 character(s)",
            "minimum": 2,
            "path": Array [
              "nestedObj",
              "name",
            ],
            "type": "string",
          },
        ]
      `);
    }
  });
});

describe('isValidationError()', () => {
  test('returns true when argument is instance of ValidationError', () => {
    expect(
      isValidationError(new ValidationError('foobar', { details: [] }))
    ).toEqual(true);
  });

  test('returns false when argument is plain Error', () => {
    expect(isValidationError(new Error('foobar'))).toEqual(false);
  });

  test('returns false when argument is not an Error', () => {
    expect(isValidationError('foobar')).toEqual(false);
    expect(isValidationError(123)).toEqual(false);
    expect(
      isValidationError({
        message: 'foobar',
      })
    ).toEqual(false);
  });
});
