import * as zod from 'zod';

import { makeErrorMap } from './errorMap.ts';

describe('makeErrorMap()', () => {
  test('handles invalid_enum_value issue', () => {
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

  test('handles invalid_string issue with email validation', () => {
    const schema = zod.string().email();

    try {
      schema.parse('abc', { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "validation": "email",
            "code": "invalid_string",
            "message": "Invalid string - does not match email validation",
            "path": []
          }
        ]]
      `);
    }
  });

  test('handles invalid_string issue with endsWith validation', () => {
    const schema = zod.string().endsWith('xyz');

    try {
      schema.parse('abc def', { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_string",
            "validation": {
              "endsWith": "xyz"
            },
            "message": "Invalid string - does not end with \\"xyz\\"",
            "path": []
          }
        ]]
      `);
    }
  });

  test('handles invalid_string issue with startsWith validation', () => {
    const schema = zod.string().startsWith('abc');

    try {
      schema.parse('def xyz', { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_string",
            "validation": {
              "startsWith": "abc"
            },
            "message": "Invalid string - does not start with \\"abc\\"",
            "path": []
          }
        ]]
      `);
    }
  });

  test('handles invalid_string issue with includes validation', () => {
    const schema = zod.string().includes('def');

    try {
      schema.parse('abc xyz', { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_string",
            "validation": {
              "includes": "def"
            },
            "message": "Invalid string - does not include \\"def\\"",
            "path": []
          }
        ]]
      `);
    }
  });

  test('handles too_big issue', () => {
    const schema = zod.string().max(2);

    try {
      schema.parse('abc', { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "too_big",
            "maximum": 2,
            "type": "string",
            "inclusive": true,
            "exact": false,
            "message": "Invalid string - must contain at most 2 character(s)",
            "path": []
          }
        ]]
      `);
    }
  });

  test('handles too_big issue with exact length', () => {
    const schema = zod.string().length(2);

    try {
      schema.parse('abc', { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "too_big",
            "maximum": 2,
            "type": "string",
            "inclusive": true,
            "exact": true,
            "message": "Invalid string - must contain exactly 2 character(s)",
            "path": []
          }
        ]]
      `);
    }
  });

  test('handles too_small issue', () => {
    const schema = zod.string().min(4);

    try {
      schema.parse('abc', { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "too_small",
            "minimum": 4,
            "type": "string",
            "inclusive": true,
            "exact": false,
            "message": "Invalid string - must contain at least 4 character(s)",
            "path": []
          }
        ]]
      `);
    }
  });

  test('handles too_small issue with exact length', () => {
    const schema = zod.string().length(4);

    try {
      schema.parse('abc', { errorMap: makeErrorMap() });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "too_small",
            "minimum": 4,
            "type": "string",
            "inclusive": true,
            "exact": true,
            "message": "Invalid string - must contain exactly 4 character(s)",
            "path": []
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
