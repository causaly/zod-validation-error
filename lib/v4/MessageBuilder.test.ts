import * as zod from 'zod/v4';

import { isNonEmptyArray } from '../utils/NonEmptyArray.ts';
import { createMessageBuilder } from './MessageBuilder.ts';
import { isZodErrorLike } from './isZodErrorLike.ts';
import { createErrorMap } from './errorMap/errorMap.ts';

describe('MessageBuilder', () => {
  const errorMap = createErrorMap({
    includePath: true,
  });

  test('handles zod.string() schema errors', () => {
    const schema = zod.email();

    const messageBuilder = createMessageBuilder({ error: errorMap });

    try {
      schema.parse('foobar', {
        reportInput: true,
      });
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Invalid email"`
        );
      }
    }
  });

  test('handles zod.object() schema errors', () => {
    const schema = zod.object({
      id: zod.int().positive(),
      name: zod.string().min(2),
    });

    const messageBuilder = createMessageBuilder({ error: errorMap });

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
          `"Validation error: Number must be greater than 0 at "id"; String must contain at least 2 character(s) at "name""`
        );
      }
    }
  });

  test('handles zod.array() schema errors', () => {
    const schema = zod.array(zod.int());

    const messageBuilder = createMessageBuilder({ error: errorMap });

    try {
      schema.parse([1, 'a', true, 1.23], {
        reportInput: true,
      });
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Expected number, received string at index 1; Expected number, received boolean at index 2; Expected int, received number at index 3"`
        );
      }
    }
  });

  test('handles nested zod.object() schema errors', () => {
    const schema = zod.object({
      id: zod.number().int().positive(),
      arr: zod.array(zod.number().int()),
      nestedObj: zod.object({
        name: zod.string().min(2),
      }),
    });

    const messageBuilder = createMessageBuilder({ error: errorMap });

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
          `"Validation error: Number must be greater than 0 at "id"; Expected number, received string at "arr[1]"; String must contain at least 2 character(s) at "nestedObj.name""`
        );
      }
    }
  });

  test('handles zod.or() schema errors', () => {
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

    const messageBuilder = createMessageBuilder({ error: errorMap });

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
          `"Validation error: Expected value to be "success" at "status"; Expected object, received undefined at "data" or Expected value to be "error" at "status""`
        );
      }
    }
  });

  test('handles zod.or() schema duplicate errors', () => {
    const schema = zod.object({
      terms: zod.array(zod.string()).or(zod.string()),
    });

    const messageBuilder = createMessageBuilder({ error: errorMap });

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
          `"Validation error: Expected array, received undefined or Expected string, received undefined at "terms""`
        );
      }
    }
  });

  test('handles zod.and() schema errors', () => {
    const part1 = zod.object({
      prop1: zod.literal('value1'),
    });
    const part2 = zod.object({
      prop2: zod.literal('value2'),
    });

    const schema = part1.and(part2);

    const messageBuilder = createMessageBuilder({ error: errorMap });

    try {
      schema.parse({});
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Expected value to be "value1" at "prop1"; Expected value to be "value2" at "prop2""`
        );
      }
    }
  });

  test('handles special characters in property name', () => {
    const schema = zod.object({
      '.': zod.string(),
      './*': zod.string(),
    });

    const messageBuilder = createMessageBuilder({ error: errorMap });

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
          `"Validation error: Expected string, received number at "."; Expected string, received boolean at "./*""`
        );
      }
    }
  });

  test('handles zod.function() argument errors', () => {
    const fn = zod
      .function({
        input: [zod.number()],
      })
      .implement((num) => num * 2);

    const messageBuilder = createMessageBuilder({ error: errorMap });

    try {
      // @ts-expect-error Intentionally wrong to exercise runtime checking
      fn('foo');
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Expected number at index 0"`
        );
      }
    }
  });

  test('handles zod.function() return value errors', () => {
    const fn = zod
      .function({
        output: zod.number(),
      })
      // @ts-expect-error Intentionally wrong to exercise runtime checking
      .implement(() => 'foo');

    const messageBuilder = createMessageBuilder({ error: errorMap });

    try {
      fn();
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Expected number"`
        );
      }
    }
  });

  test('respects `includePath` prop when set to `false`', () => {
    const schema = zod.object({
      name: zod.string().min(3),
    });

    const messageBuilder = createMessageBuilder({
      error: createErrorMap({
        includePath: false,
      }),
    });

    try {
      schema.parse({ name: 'jo' });
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: String must contain at least 3 character(s)"`
        );
      }
    }
  });

  test("returns zod's native error messages by default", () => {
    const schema = zod.object({
      name: zod.string().min(3),
    });

    const messageBuilder = createMessageBuilder({
      // note that we are not passing `error` here
      // so it will use zod's default error map
    });

    try {
      schema.parse({ name: 'jo' });
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Too small: expected string to have >=3 characters"`
        );
      }
    }
  });
});
