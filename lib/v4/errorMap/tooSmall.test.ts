import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('parseTooSmallIssue', () => {
  test('handles string input', () => {
    const schema = zod.string().min(5);
    const result = schema.safeParse('abc');
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"String must contain at least 5 character(s)"`
    );
  });

  test('handles number input', () => {
    const schema = zod.number().min(10);
    const result = schema.safeParse(5);
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Number must be greater or equal to 10"`
    );
  });

  test('handles number input using greater-than', () => {
    const schema = zod.number().gt(10);
    const result = schema.safeParse(10);
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Number must be greater than 10"`
    );
  });

  test('handles Array input', () => {
    const schema = zod.array(zod.string()).min(3);
    const result = schema.safeParse(['a']);
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Array must contain at least 3 item(s)"`
    );
  });

  test('handles Set input', () => {
    const schema = zod.set(zod.string()).min(3);
    const result = schema.safeParse(new Set(['a']));
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Set must contain at least 3 item(s)"`
    );
  });

  test('handles Date input', () => {
    const minDate = new Date('2020-01-01');
    const schema = zod.date().min(minDate);
    const result = schema.safeParse(new Date('2019-01-01'));
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toBe(
      `Date must be later or equal to "${minDate.toLocaleString()}"`
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
      `"Number must be greater or equal to 100"`
    );
  });
});
