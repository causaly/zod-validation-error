import * as zod from 'zod';
import { ZodError } from 'zod';

import { fromZodError } from './fromZodError';
import { ValidationError } from './ValidationError';

describe('fromZodError()', () => {
  test('handles zod.string() schema errors', () => {
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
        expect(validationError.issues).toMatchInlineSnapshot(`
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

  test('handles zod.object() schema errors', () => {
    const schema = zod.object({
      id: zod.number().int().positive(),
      name: zod.string().min(2),
    });

    try {
      schema.parse({
        id: -1,
        name: 'a',
      });
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Number must be greater than 0 at "id"; String must contain at least 2 character(s) at "name""`
        );
        expect(validationError.issues).toMatchInlineSnapshot(`
          [
            {
              "code": "too_small",
              "exact": false,
              "inclusive": false,
              "message": "Number must be greater than 0",
              "minimum": 0,
              "path": [
                "id",
              ],
              "type": "number",
            },
            {
              "code": "too_small",
              "exact": false,
              "inclusive": true,
              "message": "String must contain at least 2 character(s)",
              "minimum": 2,
              "path": [
                "name",
              ],
              "type": "string",
            },
          ]
      `);
      }
    }
  });

  test('handles zod.array() schema errors', () => {
    const schema = zod.array(zod.number().int());

    try {
      schema.parse([1, 'a', true, 1.23]);
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Expected number, received string at index 1; Expected number, received boolean at index 2; Expected integer, received float at index 3"`
        );
        expect(validationError.issues).toMatchInlineSnapshot(`
            [
              {
                "code": "invalid_type",
                "expected": "number",
                "message": "Expected number, received string",
                "path": [
                  1,
                ],
                "received": "string",
              },
              {
                "code": "invalid_type",
                "expected": "number",
                "message": "Expected number, received boolean",
                "path": [
                  2,
                ],
                "received": "boolean",
              },
              {
                "code": "invalid_type",
                "expected": "integer",
                "message": "Expected integer, received float",
                "path": [
                  3,
                ],
                "received": "float",
              },
            ]
        `);
      }
    }
  });

  test('handles nested zod.object() schema errors', () => {
    const schema = zod.object({
      id: zod.number().int().positive(),
      arr: zod.array(zod.number().int()),
      nestedObj: zod.object({
        name: zod.string().min(2),
      }),
    });

    try {
      schema.parse({
        id: -1,
        arr: [1, 'a'],
        nestedObj: {
          name: 'a',
        },
      });
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Number must be greater than 0 at "id"; Expected number, received string at "arr[1]"; String must contain at least 2 character(s) at "nestedObj.name""`
        );
        expect(validationError.issues).toMatchInlineSnapshot(`
            [
              {
                "code": "too_small",
                "exact": false,
                "inclusive": false,
                "message": "Number must be greater than 0",
                "minimum": 0,
                "path": [
                  "id",
                ],
                "type": "number",
              },
              {
                "code": "invalid_type",
                "expected": "number",
                "message": "Expected number, received string",
                "path": [
                  "arr",
                  1,
                ],
                "received": "string",
              },
              {
                "code": "too_small",
                "exact": false,
                "inclusive": true,
                "message": "String must contain at least 2 character(s)",
                "minimum": 2,
                "path": [
                  "nestedObj",
                  "name",
                ],
                "type": "string",
              },
            ]
        `);
      }
    }
  });

  test('schema.parse() path param to be part of error message', () => {
    const schema = zod.object({
      status: zod.literal('success'),
    });

    try {
      schema.parse(
        {},
        {
          path: ['custom-path'],
        }
      );
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Invalid literal value, expected "success" at "custom-path.status""`
        );
        expect(validationError.issues).toMatchInlineSnapshot(`
          [
            {
              "code": "invalid_literal",
              "expected": "success",
              "message": "Invalid literal value, expected "success"",
              "path": [
                "custom-path",
                "status",
              ],
              "received": undefined,
            },
          ]
        `);
      }
    }
  });

  test('handles zod.or() schema errors', () => {
    const success = zod.object({
      status: zod.literal('success'),
      data: zod.object({
        id: zod.string(),
      }),
    });

    const error = zod.object({
      status: zod.literal('error'),
    });

    const schema = success.or(error);

    try {
      schema.parse({});
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Invalid literal value, expected "success" at "status"; Required at "data", or Invalid literal value, expected "error" at "status""`
        );
        expect(validationError.issues).toMatchInlineSnapshot(`
          [
            {
              "code": "invalid_union",
              "message": "Invalid input",
              "path": [],
              "unionErrors": [
                [ZodError: [
            {
              "code": "invalid_literal",
              "expected": "success",
              "path": [
                "status"
              ],
              "message": "Invalid literal value, expected \\"success\\""
            },
            {
              "code": "invalid_type",
              "expected": "object",
              "received": "undefined",
              "path": [
                "data"
              ],
              "message": "Required"
            }
          ]],
                [ZodError: [
            {
              "code": "invalid_literal",
              "expected": "error",
              "path": [
                "status"
              ],
              "message": "Invalid literal value, expected \\"error\\""
            }
          ]],
              ],
            },
          ]
        `);
      }
    }
  });

  test('handles zod.or() schema duplicate errors', () => {
    const schema = zod.object({
      terms: zod.array(zod.string()).or(zod.string()),
    });

    try {
      schema.parse({});
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Required at "terms""`
        );
        expect(validationError.issues).toMatchInlineSnapshot(`
          [
            {
              "code": "invalid_union",
              "message": "Invalid input",
              "path": [
                "terms",
              ],
              "unionErrors": [
                [ZodError: [
            {
              "code": "invalid_type",
              "expected": "array",
              "received": "undefined",
              "path": [
                "terms"
              ],
              "message": "Required"
            }
          ]],
                [ZodError: [
            {
              "code": "invalid_type",
              "expected": "string",
              "received": "undefined",
              "path": [
                "terms"
              ],
              "message": "Required"
            }
          ]],
              ],
            },
          ]
        `);
      }
    }
  });

  test('handles zod.and() schema errors', () => {
    const part1 = zod.object({
      prop1: zod.literal('value1'),
    });
    const part2 = zod.object({
      prop2: zod.literal('value2'),
    });

    const schema = part1.and(part2);

    try {
      schema.parse({});
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Invalid literal value, expected "value1" at "prop1"; Invalid literal value, expected "value2" at "prop2""`
        );
        expect(validationError.issues).toMatchInlineSnapshot(`
          [
            {
              "code": "invalid_literal",
              "expected": "value1",
              "message": "Invalid literal value, expected "value1"",
              "path": [
                "prop1",
              ],
              "received": undefined,
            },
            {
              "code": "invalid_literal",
              "expected": "value2",
              "message": "Invalid literal value, expected "value2"",
              "path": [
                "prop2",
              ],
              "received": undefined,
            },
          ]
        `);
      }
    }
  });

  test('handles special characters in property name', () => {
    const schema = zod.object({
      '.': zod.string(),
      './*': zod.string(),
    });

    try {
      schema.parse({
        '.': 123,
        './*': false,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: Expected string, received number at "."; Expected string, received boolean at "./*""`
        );
        expect(validationError.issues).toMatchInlineSnapshot(`
          [
            {
              "code": "invalid_type",
              "expected": "string",
              "message": "Expected string, received number",
              "path": [
                ".",
              ],
              "received": "number",
            },
            {
              "code": "invalid_type",
              "expected": "string",
              "message": "Expected string, received boolean",
              "path": [
                "./*",
              ],
              "received": "boolean",
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
      if (err instanceof ZodError) {
        const validationError = fromZodError(err, { includePath: false });
        expect(validationError).toBeInstanceOf(ValidationError);
        expect(validationError.message).toMatchInlineSnapshot(
          `"Validation error: "Name" must be at least 3 characters"`
        );
      }
    }
  });
});
