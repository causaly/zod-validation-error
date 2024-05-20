import * as zod from 'zod';

import { makeErrorMap } from './errorMap.ts';

describe('makeErrorMap()', () => {
  test('maps invalid_enum_value issue', () => {
    const schema = zod.enum(['foo', 'bar']);

    try {
      schema.parse('foobar', { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "received": "foobar",
            "code": "invalid_enum_value",
            "options": [
              "foo",
              "bar"
            ],
            "path": [],
            "message": "Invalid enum value - expected \\"foo\\" or \\"bar\\", received \\"foobar\\""
          }
        ]]
      `);
    }
  });

  test('truncates invalid_enum_value issue with too many options', () => {
    const schema = zod.enum(['a', 'b', 'c', 'd', 'e', 'f']);

    try {
      schema.parse('w', {
        errorMap: makeErrorMap({
          maxEnumValues: 3,
        }),
      });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "received": "w",
            "code": "invalid_enum_value",
            "options": [
              "a",
              "b",
              "c",
              "d",
              "e",
              "f"
            ],
            "path": [],
            "message": "Invalid enum value - expected \\"a\\", \\"b\\", \\"c\\" or 3 more values, received \\"w\\""
          }
        ]]
      `);
    }
  });

  test('handles invalid_literal issue', () => {
    const schema = zod.literal('foo');

    try {
      schema.parse('bar', { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "received": "bar",
            "code": "invalid_literal",
            "expected": "foo",
            "path": [],
            "message": "Invalid literal value - expected \\"foo\\", received \\"bar\\""
          }
        ]]
      `);
    }
  });

  test('handles invalid_literal issue with numeric literal', () => {
    const schema = zod.literal(123);

    try {
      schema.parse(456, { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "received": 456,
            "code": "invalid_literal",
            "expected": 123,
            "path": [],
            "message": "Invalid literal value - expected 123, received 456"
          }
        ]]
      `);
    }
  });

  test('handles invalid_literal issue with boolean literal', () => {
    const schema = zod.literal(true);

    try {
      schema.parse(false, { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "received": false,
            "code": "invalid_literal",
            "expected": true,
            "path": [],
            "message": "Invalid literal value - expected true, received false"
          }
        ]]
      `);
    }
  });

  test('handles invalid_type issue', () => {
    const schema = zod.number();

    try {
      schema.parse('abc', { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_type",
            "expected": "number",
            "received": "string",
            "path": [],
            "message": "Invalid type - expected number, received string"
          }
        ]]
      `);
    }
  });

  test('handles invalid_union issue', () => {
    const schema = zod.union([
      zod.number().int().positive(),
      zod.number().negative(),
      zod.string(),
    ]);

    try {
      schema.parse({}, { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_union",
            "unionErrors": [
              {
                "issues": [
                  {
                    "code": "invalid_type",
                    "expected": "number",
                    "received": "object",
                    "path": [],
                    "message": "Invalid type - expected number, received object"
                  }
                ],
                "name": "ZodError"
              },
              {
                "issues": [
                  {
                    "code": "invalid_type",
                    "expected": "number",
                    "received": "object",
                    "path": [],
                    "message": "Invalid type - expected number, received object"
                  }
                ],
                "name": "ZodError"
              },
              {
                "issues": [
                  {
                    "code": "invalid_type",
                    "expected": "string",
                    "received": "object",
                    "path": [],
                    "message": "Invalid type - expected string, received object"
                  }
                ],
                "name": "ZodError"
              }
            ],
            "path": [],
            "message": "Invalid union - expected number or string, received object"
          }
        ]]
      `);
    }
  });
});
