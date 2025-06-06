import * as zod from 'zod/v4';

import { createErrorMap } from './errorMap.ts';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

describe('parseInvalidValueIssue', () => {
  describe('zod.enum', () => {
    test('handles string values', () => {
      const schema = zod.object({
        input: zod.enum(['foo', 'bar']),
      });
      const result = schema.safeParse({ input: 'abc' });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"Expected value to be one of "foo" or "bar" at "input""`
      );
    });

    test('handles mixed values', () => {
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
        `"Expected value to be one of 1, "two" or 3 at "input""`
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
              allowedValuesSeparator: '|',
              allowedValuesLastSeparator: undefined,
              wrapAllowedValuesInQuote: false,
              maxAllowedValuesToDisplay: 3,
            }),
          }
        ),
      });
      const result = schema.safeParse({ input: 'four' });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"Expected value to be one of 1|two|3"`
      );
    });

    test('handles single-value', () => {
      const schema = zod.object({
        input: zod.enum({
          one: 1,
        }),
      });
      const result = schema.safeParse({ input: 'four' });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"Expected value to be 1 at "input""`
      );
    });

    test('handles excessive values to display', () => {
      const schema = zod.object({
        input: zod.enum({
          one: 'one',
          two: 'two',
          three: 'three',
          four: 'four',
          five: 'five',
          six: 'six',
          seven: 'seven',
        }),
      });
      const result = schema.safeParse(
        { input: 'fourtytwo' },
        {
          error: createErrorMap({
            includePath: false,
            maxAllowedValuesToDisplay: 3,
          }),
        }
      );
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"Expected value to be one of "one", "two", "three" or 4 more value(s)"`
      );
    });
  });

  describe('zod.literal', () => {
    test('handles string value', () => {
      const schema = zod.object({
        input: zod.literal('foo'),
      });
      const result = schema.safeParse({ input: 'bar' });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"Expected value to be "foo" at "input""`
      );
    });

    test('handles numeric value', () => {
      const schema = zod.object({
        input: zod.literal(123),
      });
      const result = schema.safeParse({ input: 321 });
      if (result.success) {
        throw new Error('Expected failure');
      }

      expect(result.error.issues[0].message).toMatchInlineSnapshot(
        `"Expected value to be 123 at "input""`
      );
    });
  });
});
