import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('parseTooBigIssue', () => {
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
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"String must contain at most 3 character(s) at "input""`
    );
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
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Number must be less or equal to 10 at "input""`
    );
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
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Number must be less than 10 at "input""`
    );
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
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Array must contain at most 2 item(s) at "input""`
    );
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
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Set must contain at most 2 item(s) at "input""`
    );
  });

  test('handles Date input', () => {
    const schema = zod.object({
      input: zod.date().max(new Date('2020/01/01')),
    });
    const result = schema.safeParse({
      input: new Date('2021-01-01'),
    });
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Date must be prior or equal to "1/1/2020, 12:00:00 AM" at "input""`
    );
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
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Number must be less or equal to 100 at "input""`
    );
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
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Custom error message"`
    );
  });
});
