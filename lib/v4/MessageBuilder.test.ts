import * as zod from 'zod/v4';

import { isNonEmptyArray } from '../utils/NonEmptyArray.ts';
import { createMessageBuilder } from './MessageBuilder.ts';
import { isZodErrorLike } from './isZodErrorLike.ts';
import { createErrorMap } from './errorMap/index.ts';

describe('MessageBuilder', () => {
  describe('zod.string', () => {
    test('handles invalid format', () => {
      const schema = zod.email();

      const messageBuilder = createMessageBuilder();

      try {
        schema.parse('foobar', {
          reportInput: true,
        });
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Invalid email address"`
          );
        }
      }
    });
  });

  describe('zod.object', () => {
    test('handles invalid property', () => {
      const schema = zod.object({
        id: zod.int().positive(),
        name: zod.string().min(2),
      });

      const messageBuilder = createMessageBuilder();

      try {
        schema.parse(
          {
            id: -1,
            name: 'a',
          },
          {
            reportInput: true,
          }
        );
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Too small: expected number to be >0 at "id"; Too small: expected string to have >=2 characters at "name""`
          );
        }
      }
    });

    test('handles invalid nested property', () => {
      const schema = zod.object({
        id: zod.number().int().positive(),
        arr: zod.array(zod.number().int()),
        nestedObj: zod.object({
          name: zod.string().min(2),
        }),
      });

      const messageBuilder = createMessageBuilder();

      try {
        schema.parse(
          {
            id: -1,
            arr: [1, 'a'],
            nestedObj: {
              name: 'a',
            },
          },
          {
            reportInput: true,
          }
        );
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Too small: expected number to be >0 at "id"; Invalid input: expected number, received string at "arr[1]"; Too small: expected string to have >=2 characters at "nestedObj.name""`
          );
        }
      }
    });

    test('handles special characters in property name', () => {
      const schema = zod.object({
        '.': zod.string(),
        './*': zod.string(),
      });

      const messageBuilder = createMessageBuilder();

      try {
        schema.parse(
          {
            '.': 123,
            './*': false,
          },
          {
            reportInput: true,
          }
        );
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Invalid input: expected string, received number at "."; Invalid input: expected string, received boolean at "./*""`
          );
        }
      }
    });
  });

  describe('zod.array', () => {
    test('handles invalid items', () => {
      const schema = zod.array(zod.int());

      const messageBuilder = createMessageBuilder();

      try {
        schema.parse([1, 'a', true, 1.23], {
          reportInput: true,
        });
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Invalid input: expected number, received string at index 1; Invalid input: expected number, received boolean at index 2; Invalid input: expected int, received number at index 3"`
          );
        }
      }
    });
  });

  describe('zod.or', () => {
    test('handles invalid input', () => {
      const success = zod.object({
        status: zod.literal('success'),
        data: zod.object({
          id: zod.string(),
        }),
      });

      const error = zod.object({
        status: zod.literal('error'),
      });

      const schema = success.or(error);

      const messageBuilder = createMessageBuilder();

      try {
        schema.parse(
          { data: undefined },
          {
            reportInput: true,
          }
        );
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Invalid input: expected "success" at "status"; Invalid input: expected object, received undefined at "data" or Invalid input: expected "error" at "status""`
          );
        }
      }
    });

    test('handles duplicate errors', () => {
      const schema = zod.object({
        terms: zod.array(zod.string()).or(zod.string()),
      });

      const messageBuilder = createMessageBuilder();

      try {
        schema.parse(
          {},
          {
            reportInput: true,
          }
        );
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Invalid input: expected array, received undefined at "terms" or Invalid input: expected string, received undefined at "terms""`
          );
        }
      }
    });
  });

  describe('zod.and', () => {
    test('handles invalid input', () => {
      const part1 = zod.object({
        prop1: zod.literal('value1'),
      });
      const part2 = zod.object({
        prop2: zod.literal('value2'),
      });

      const schema = part1.and(part2);

      const messageBuilder = createMessageBuilder();

      try {
        schema.parse({});
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Invalid input: expected "value1" at "prop1"; Invalid input: expected "value2" at "prop2""`
          );
        }
      }
    });
  });

  describe('zod.function', () => {
    test('handles argument errors', () => {
      const fn = zod
        .function({
          input: [zod.number()],
        })
        .implement((num) => num * 2);

      const messageBuilder = createMessageBuilder();

      try {
        // @ts-expect-error Intentionally wrong to exercise runtime checking
        fn('foo');
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Invalid input: expected number, received string at index 0"`
          );
        }
      }
    });

    test('handles return value errors', () => {
      const fn = zod
        .function({
          output: zod.number(),
        })
        // @ts-expect-error Intentionally wrong to exercise runtime checking
        .implement(() => 'foo');

      const messageBuilder = createMessageBuilder();

      try {
        fn();
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Invalid input: expected number, received string"`
          );
        }
      }
    });
  });

  describe('zod.union', () => {
    test('handles primitive string|null error', () => {
      const schema = zod.union([zod.string(), zod.null()]);

      const messageBuilder = createMessageBuilder({
        includePath: true,
      });

      try {
        schema.parse(10);
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Invalid input: expected string, received number or Invalid input: expected null, received number"`
          );
        }
      }
    });
  });

  describe('zod.discriminatedUnion', () => {
    test('handles invalid input', () => {
      const schema = zod.discriminatedUnion('type', [
        zod.object({ type: zod.literal('a'), foo: zod.string() }),
        zod.object({ type: zod.literal('b'), bar: zod.string() }),
      ]);

      const messageBuilder = createMessageBuilder({
        includePath: true,
      });

      try {
        schema.parse({});
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Invalid input at "type""`
          );
        }
      }
    });

    test('accepts custom error message', () => {
      const schema = zod.discriminatedUnion(
        'type',
        [
          zod.object({ type: zod.literal('a'), foo: zod.string() }),
          zod.object({ type: zod.literal('b'), bar: zod.string() }),
        ],
        {
          // custom error message
          error: 'custom error message',
        }
      );

      const messageBuilder = createMessageBuilder({
        includePath: true,
      });

      try {
        schema.parse({});
      } catch (err) {
        if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
          const message = messageBuilder(err.issues);
          expect(message).toMatchInlineSnapshot(
            `"Validation error: Custom error message at "type""`
          );
        }
      }
    });
  });

  describe('custom errorMap', () => {
    beforeAll(() => {
      zod.config({
        customError: createErrorMap(),
      });
    });

    afterAll(() => {
      zod.config({
        customError: undefined,
      });
    });

    describe('zod.union', () => {
      test('handles primitive string|null error', () => {
        const schema = zod.union([zod.string(), zod.null()]);

        const messageBuilder = createMessageBuilder();

        try {
          schema.parse(10);
        } catch (err) {
          if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
            const message = messageBuilder(err.issues);
            expect(message).toMatchInlineSnapshot(
              `"Validation error: Expected string, received number or Expected null, received number"`
            );
          }
        }
      });
    });
  });
});
