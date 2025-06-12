import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('parseInvalidTypeIssue', () => {
  test('handles object element', () => {
    const schema = zod.object({
      input: zod.string(),
    });
    const result = schema.safeParse({ input: 123 });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Expected string, received number at "input""`
    );
  });

  test('handles array element', () => {
    const schema = zod.array(zod.int());
    const result = schema.safeParse(['abc', true, new Date()]);

    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Expected number, received string at index 0"`
    );
  });

  test('handles missing property in object', () => {
    const schema = zod.object({
      input: zod.string(),
    });
    const result = schema.safeParse({});
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Expected string, received undefined at "input""`
    );
  });

  test('handles undefined property in object', () => {
    const schema = zod.object({
      input: zod.string(),
    });
    const result = schema.safeParse({ input: undefined });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Expected string, received undefined at "input""`
    );
  });

  test('handles null property in object', () => {
    const schema = zod.object({
      input: zod.string(),
    });
    const result = schema.safeParse({ input: null });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Expected string, received null at "input""`
    );
  });
});
