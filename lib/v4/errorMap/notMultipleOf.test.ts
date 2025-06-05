import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('parseNotMultipleOfIssue', () => {
  test('handles ZodIssueNotMultipleOf', () => {
    const schema = zod.object({
      input: zod.int().multipleOf(2),
    });
    const result = schema.safeParse({
      input: 3,
    });
    if (result.success) {
      throw new Error('Expected failure');
    }
    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Expected multiple of 2 at "input""`
    );
  });
});
