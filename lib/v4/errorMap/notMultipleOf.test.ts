import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('not_multiple_of issue parser', () => {
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
      `"invalid value at "input"; expected multiple of 2"`
    );
  });
});
