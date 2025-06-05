import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('parseInvalidUnionIssue', () => {
  test('handles json_string format', () => {
    const schema = zod.object({
      input: zod.json(),
    });
    const result = schema.safeParse({ input: new Date() });
    if (result.success) throw new Error('Expected failure');

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Expected string or Expected number or Expected boolean or Expected null or Expected array or Expected record at "input""`
    );
  });
});
