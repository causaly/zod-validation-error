import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('parseUnrecognizedKeysIssue', () => {
  test('handles single unrecognized key', () => {
    const schema = zod
      .object({
        a1: zod.string(),
      })
      .strict();
    const result = schema.safeParse({
      a1: 'a1',
      b2: 'b2',
    });
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Unrecognized key(s) "b2" in object"`
    );
  });

  test('handles multiple unrecognized keys', () => {
    const schema = zod
      .object({
        a1: zod.string(),
      })
      .strict();
    const result = schema.safeParse({
      a1: 'a1',
      b2: 'b2',
      c3: 'c3',
      d4: 'd4',
    });
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Unrecognized key(s) "b2", "c3" and "d4" in object"`
    );
  });
});
