import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('parseInvalidValueIssue', () => {
  test('handles string enumeration', () => {
    const schema = zod.object({
      input: zod.enum(['foo', 'bar']),
    });
    const result = schema.safeParse({ input: 'abc' });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"invalid value at "input"; expected one of "foo" or "bar""`
    );
  });

  test('handles mixed enumeration', () => {
    const schema = zod.object({
      input: zod.enum({
        one: 1,
        two: 'two',
        three: 3,
      }),
    });
    const result = schema.safeParse({ input: 'four' });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"invalid value at "input"; expected one of 1, "two" or 3"`
    );
  });

  test('handles string literal', () => {
    const schema = zod.object({
      input: zod.literal('foo'),
    });
    const result = schema.safeParse({ input: 'bar' });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"invalid value at "input"; expected "foo""`
    );
  });

  test('handles numeric literal', () => {
    const schema = zod.object({
      input: zod.literal(123),
    });
    const result = schema.safeParse({ input: 321 });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"invalid value at "input"; expected 123"`
    );
  });

  test('accepts custom options', () => {
    const schema = zod.object({
      input: zod.enum(
        {
          one: 1,
          two: 'two',
          three: 3,
        },
        {
          error: createErrorMap({
            includePath: false,
            valuesSeparator: '|',
            valuesLastSeparator: undefined,
            wrapStringValuesInQuote: false,
            maxValuesToDisplay: 2,
          }),
        }
      ),
    });
    const result = schema.safeParse({ input: 'four' });
    if (result.success) {
      throw new Error('Expected failure');
    }

    expect(result.error.issues[0].message).toMatchInlineSnapshot(
      `"invalid value; expected one of 1|two"`
    );
  });
});
