import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('invalid_type issue parser', () => {
  test('handles ZodIssueInvalidType', () => {
    const schema = zod.object({
      input: zod.string(),
    });
    const result = schema.safeParse({ input: 123 });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"invalid type at "input"; expected string, received number"`
    );
  });
});
