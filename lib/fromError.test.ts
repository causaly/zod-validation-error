import * as zod from 'zod';

import { fromError } from './fromError.ts';

describe('fromError()', () => {
  test('handles a ZodError', () => {
    const schema = zod.string().email();
    const { error } = schema.safeParse('foobar');

    const validationError = fromError(error);

    expect(validationError).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Invalid email]`
    );
  });

  test('handles a generic Error', () => {
    const error = new Error('Something went wrong');

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

  test('respects options provided', () => {
    const schema = zod.object({
      username: zod.string().min(1),
      password: zod.string().min(1),
    });
    const { error } = schema.safeParse({});

    const validationError = fromError(error, { issueSeparator: ', ' });

    expect(validationError).toMatchInlineSnapshot(
      `[ZodValidationError: Validation error: Required at "username", Required at "password"]`
    );
  });
});
