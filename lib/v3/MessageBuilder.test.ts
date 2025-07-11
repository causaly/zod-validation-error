import * as zod from 'zod/v3';

import { isNonEmptyArray } from '../utils/NonEmptyArray.ts';
import { createMessageBuilder } from './MessageBuilder.ts';
import { isZodErrorLike } from './isZodErrorLike.ts';

describe('MessageBuilder', () => {
  test('handles zod.string() schema errors', () => {
    const schema = zod.string().email();

    const messageBuilder = createMessageBuilder();

    try {
      schema.parse('foobar');
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
      id: zod.number().int().positive(),
      name: zod.string().min(2),
    });

    const messageBuilder = createMessageBuilder();

    try {
      schema.parse({
        id: -1,
        name: 'a',
      });
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
    const schema = zod.array(zod.number().int());

    const messageBuilder = createMessageBuilder();

    try {
      schema.parse([1, 'a', true, 1.23]);
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Expected number, received string at index 1; Expected number, received boolean at index 2; Expected integer, received float at index 3"`
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

    const messageBuilder = createMessageBuilder();

    try {
      schema.parse({
        id: -1,
        arr: [1, 'a'],
        nestedObj: {
          name: 'a',
        },
      });
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Number must be greater than 0 at "id"; Expected number, received string at "arr[1]"; String must contain at least 2 character(s) at "nestedObj.name""`
        );
      }
    }
  });

  test('schema.parse() path param to be part of error message', () => {
    const schema = zod.object({
      status: zod.literal('success'),
    });

    const messageBuilder = createMessageBuilder();

    try {
      schema.parse(
        {},
        {
          path: ['custom-path'],
        }
      );
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Invalid literal value, expected "success" at "custom-path.status""`
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

    const messageBuilder = createMessageBuilder();

    try {
      schema.parse({});
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Invalid literal value, expected "success" at "status"; Required at "data", or Invalid literal value, expected "error" at "status""`
        );
      }
    }
  });

  test('handles zod.or() schema duplicate errors', () => {
    const schema = zod.object({
      terms: zod.array(zod.string()).or(zod.string()),
    });

    const messageBuilder = createMessageBuilder();

    try {
      schema.parse({});
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Required at "terms""`
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

    const messageBuilder = createMessageBuilder();

    try {
      schema.parse({});
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Invalid literal value, expected "value1" at "prop1"; Invalid literal value, expected "value2" at "prop2""`
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
      schema.parse({
        '.': 123,
        './*': false,
      });
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
      .function()
      .args(zod.number())
      .implement((num) => num * 2);

    const messageBuilder = createMessageBuilder();

    try {
      // @ts-expect-error Intentionally wrong to exercise runtime checking
      fn('foo');
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Invalid function arguments; Expected number, received string at index 0"`
        );
      }
    }
  });

  test('handles zod.function() return value errors', () => {
    const fn = zod
      .function()
      .returns(zod.number())
      // @ts-expect-error Intentionally wrong to exercise runtime checking
      .implement(() => 'foo');

    const messageBuilder = createMessageBuilder();

    try {
      fn();
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: Invalid function return type; Expected number, received string"`
        );
      }
    }
  });

  test('respects `includePath` prop when set to `false`', () => {
    const schema = zod.object({
      name: zod.string().min(3, '"Name" must be at least 3 characters'),
    });

    const messageBuilder = createMessageBuilder({
      includePath: false,
    });

    try {
      schema.parse({ name: 'jo' });
    } catch (err) {
      if (isZodErrorLike(err) && isNonEmptyArray(err.issues)) {
        const message = messageBuilder(err.issues);
        expect(message).toMatchInlineSnapshot(
          `"Validation error: "Name" must be at least 3 characters"`
        );
      }
    }
  });
});
