import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('too_small issue parser', () => {
  test('handles string input', () => {
    const schema = zod.string().min(5);
    const result = schema.safeParse('abc');
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"string is too short; expected > 5 characters, received 3 characters"`
    );
  });

  test('handles number input', () => {
    const schema = zod.number().min(10);
    const result = schema.safeParse(5);
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"number is too small; expected >= 10, received 5"`
    );
  });

  test('handles number input using greater-than', () => {
    const schema = zod.number().gt(10);
    const result = schema.safeParse(10);
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"number is too small; expected > 10, received 10"`
    );
  });

  test('handles Array input', () => {
    const schema = zod.array(zod.string()).min(3);
    const result = schema.safeParse(['a']);
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"array contains too few items; expected > 3 in size, received 1 item"`
    );
  });

  test('handles Set input', () => {
    const schema = zod.set(zod.string()).min(3);
    const result = schema.safeParse(new Set(['a']));
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"set contains too few items; expected > 3 in size, received 1 item"`
    );
  });

  test('handles Date input', () => {
    const schema = zod.date().min(new Date('2020-01-01'));
    const result = schema.safeParse(new Date('2019-01-01'));
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"invalid date; expected later or equal to 1/1/2020, 2:00:00 AM"`
    );
  });

  test('respects custom error message', () => {
    const schema = zod.date().min(new Date('2020-01-01'), {
      message: 'Custom error message',
    });
    const result = schema.safeParse(new Date('2019-01-01'));
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Custom error message"`
    );
  });

  test('handles BigInt input', () => {
    const schema = zod.bigint().min(100n);
    const result = schema.safeParse(50n);
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"number is too small; expected >= 100, received 50"`
    );
  });
});
