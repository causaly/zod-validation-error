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
      `"Expected string at "input" or Expected number at "input" or Expected boolean at "input" or Expected null at "input" or Expected array at "input" or Expected record at "input""`
    );
  });

  test('handle nested errors', () => {
    const baz = zod.number().min(1).optional();

    const bar = zod.strictObject({
      baz,
    });

    const foo = zod.strictObject({
      bar: zod.literal(false).or(bar).optional(),
    });

    const schema = zod.object({
      foo,
    });

    const result = schema.safeParse({
      foo: {
        bar: {
          baz: 0,
        },
      },
    });
    if (result.success) throw new Error('Expected failure');

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"Expected value to be false at "foo.bar" or Number must be greater or equal to 1 at "foo.bar.baz""`
    );
  });
});
