import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('errorMap', () => {
  test('handles ZodIssueInvalidType', () => {
    const schema = zod.object({
      input: zod.string(),
    });
    const result = schema.safeParse({ input: 123 });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues).toMatchInlineSnapshot(`
      [
        {
          "code": "invalid_type",
          "expected": "string",
          "message": "invalid type at "input"; expected string, received number",
          "path": [
            "input",
          ],
        },
      ]
    `);
  });

  describe('ZodIssueTooBig', () => {
    test('handles string input', () => {
      const schema = zod.object({
        input: zod.string().max(3),
      });
      const result = schema.safeParse({
        input: 'hello',
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_big",
          "maximum": 3,
          "message": "string contains too many characters at "input"; expected < 3 characters, received 5 characters",
          "origin": "string",
          "path": [
            "input",
          ],
        }
      `);
    });

    test('handles number input', () => {
      const schema = zod.object({
        input: zod.number().max(10),
      });
      const result = schema.safeParse({
        input: 20,
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_big",
          "inclusive": true,
          "maximum": 10,
          "message": "number too big at "input"; expected <= 10, received 20",
          "origin": "number",
          "path": [
            "input",
          ],
        }
      `);
    });

    test('handles number input using less-than', () => {
      const schema = zod.object({
        input: zod.number().lt(10),
      });
      const result = schema.safeParse({
        input: 10,
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_big",
          "inclusive": false,
          "maximum": 10,
          "message": "number too big at "input"; expected < 10, received 10",
          "origin": "number",
          "path": [
            "input",
          ],
        }
      `);
    });

    test('handles Array input', () => {
      const schema = zod.object({
        input: zod.array(zod.string()).max(2),
      });
      const result = schema.safeParse({
        input: ['a', 'b', 'c'],
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_big",
          "maximum": 2,
          "message": "array contains too many items at "input"; expected < 2 in size, received 3 items",
          "origin": "array",
          "path": [
            "input",
          ],
        }
      `);
    });

    test('handles Set input', () => {
      const schema = zod.object({
        input: zod.set(zod.string()).max(2),
      });
      const result = schema.safeParse({
        input: new Set(['a', 'b', 'c']),
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_big",
          "maximum": 2,
          "message": "set contains too many items at "input"; expected < 2 in size, received 3 items",
          "origin": "set",
          "path": [
            "input",
          ],
        }
      `);
    });

    test('handles Date input', () => {
      const schema = zod.object({
        input: zod.date().max(new Date('2020-01-01')),
      });
      const result = schema.safeParse({
        input: new Date('2021-01-01'),
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_big",
          "inclusive": true,
          "maximum": 2020-01-01T00:00:00.000Z,
          "message": "invalid date at "input"; expected prior or equal to 1/1/2020, 2:00:00 AM",
          "origin": "date",
          "path": [
            "input",
          ],
        }
      `);
    });

    test('handles BigInt input', () => {
      const schema = zod.object({
        input: zod.bigint().max(100n),
      });
      const result = schema.safeParse({
        input: 200n,
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_big",
          "inclusive": true,
          "maximum": 100n,
          "message": "number too big at "input"; expected <= 100, received 200",
          "origin": "bigint",
          "path": [
            "input",
          ],
        }
      `);
    });

    test('respects custom error message', () => {
      const schema = zod.object({
        input: zod.bigint().max(100n, {
          message: 'Custom error message',
        }),
      });
      const result = schema.safeParse({
        input: 200n,
      });
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_big",
          "inclusive": true,
          "maximum": 100n,
          "message": "Custom error message",
          "origin": "bigint",
          "path": [
            "input",
          ],
        }
      `);
    });
  });

  describe('ZodIssueTooSmall', () => {
    test('handles string input', () => {
      const schema = zod.string().min(5);
      const result = schema.safeParse('abc');
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_small",
          "message": "string is too short; expected > 5 characters, received 3 characters",
          "minimum": 5,
          "origin": "string",
          "path": [],
        }
      `);
    });

    test('handles number input', () => {
      const schema = zod.number().min(10);
      const result = schema.safeParse(5);
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_small",
          "inclusive": true,
          "message": "number is too small; expected >= 10, received 5",
          "minimum": 10,
          "origin": "number",
          "path": [],
        }
      `);
    });

    test('handles number input using greater-than', () => {
      const schema = zod.number().gt(10);
      const result = schema.safeParse(10);
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_small",
          "inclusive": false,
          "message": "number is too small; expected > 10, received 10",
          "minimum": 10,
          "origin": "number",
          "path": [],
        }
      `);
    });

    test('handles Array input', () => {
      const schema = zod.array(zod.string()).min(3);
      const result = schema.safeParse(['a']);
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_small",
          "message": "array contains too few items; expected > 3 in size, received 1 item",
          "minimum": 3,
          "origin": "array",
          "path": [],
        }
      `);
    });

    test('handles Set input', () => {
      const schema = zod.set(zod.string()).min(3);
      const result = schema.safeParse(new Set(['a']));
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_small",
          "message": "set contains too few items; expected > 3 in size, received 1 item",
          "minimum": 3,
          "origin": "set",
          "path": [],
        }
      `);
    });

    test('handles Date input', () => {
      const schema = zod.date().min(new Date('2020-01-01'));
      const result = schema.safeParse(new Date('2019-01-01'));
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_small",
          "inclusive": true,
          "message": "invalid date; expected later or equal to 1/1/2020, 2:00:00 AM",
          "minimum": 2020-01-01T00:00:00.000Z,
          "origin": "date",
          "path": [],
        }
      `);
    });

    test('respects custom error message', () => {
      const schema = zod.date().min(new Date('2020-01-01'), {
        message: 'Custom error message',
      });
      const result = schema.safeParse(new Date('2019-01-01'));
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_small",
          "inclusive": true,
          "message": "Custom error message",
          "minimum": 2020-01-01T00:00:00.000Z,
          "origin": "date",
          "path": [],
        }
      `);
    });

    test('handles BigInt input', () => {
      const schema = zod.bigint().min(100n);
      const result = schema.safeParse(50n);
      if (result.success) {
        throw new Error('Expected failure');
      }
      expect(result.error.issues[0]).toMatchInlineSnapshot(`
        {
          "code": "too_small",
          "inclusive": true,
          "message": "number is too small; expected >= 100, received 50",
          "minimum": 100n,
          "origin": "bigint",
          "path": [],
        }
      `);
    });
  });
});
