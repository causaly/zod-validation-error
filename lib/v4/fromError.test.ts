import * as zod from 'zod/v4';

import { fromError } from './fromError.ts';
import { createErrorMap } from './errorMap/errorMap.ts';

describe('fromError()', () => {
  test('handles a ZodError', () => {
    const schema = zod.email();
    const { error } = schema.safeParse('foobar');

    const validationError = fromError(error);

    expect(validationError).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid email address]`
    );
  });

  test('handles a generic Error', () => {
    const error = new Error('Something went wrong');

    const validationError = fromError(error);

    expect(validationError).toMatchInlineSnapshot(
      `[ZodValidationError: Something went wrong]`
    );
  });

  test('handles other ecmascript-native errors, such as ReferenceError', () => {
    const error = new ReferenceError('Something went wrong');

    const validationError = fromError(error);

    expect(validationError).toMatchInlineSnapshot(
      `[ZodValidationError: Something went wrong]`
    );
  });

  test('handles other ecmascript-native errors, such as TypeError', () => {
    const error = new TypeError('Something went wrong');

    const validationError = fromError(error);

    expect(validationError).toMatchInlineSnapshot(
      `[ZodValidationError: Something went wrong]`
    );
  });

  test('handles a random input', () => {
    const error = 'I am pretending to be an error';

    const validationError = fromError(error);

    expect(validationError).toMatchInlineSnapshot(
      `[ZodValidationError: Unknown error]`
    );
  });

  test('accepts custom error map', () => {
    const schema = zod.object({
      username: zod.string().min(1),
      password: zod.string().min(1),
    });
    const { error } = schema.safeParse({});
    const errorMap = createErrorMap({
      includePath: true,
    });

    const validationError = fromError(error, {
      error: errorMap,
      issueSeparator: ', ',
    });

    expect(validationError).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Expected string at "username", Expected string at "password"]`
    );
  });
});
