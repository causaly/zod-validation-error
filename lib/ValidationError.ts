import * as zod from 'zod';

import { joinPath } from './utils/joinPath';

const PREFIX_COPY = 'Validation error';
const MAX_ISSUES_IN_REASON = 10;

export class ValidationError extends Error {
  details: Array<Zod.ZodIssue>;

  constructor(
    message: string,
    options: {
      details: Array<Zod.ZodIssue>;
    }
  ) {
    super(message);
    this.details = options.details;
  }
}

/**
 * Converts the supplied ZodError to ValidationError.
 * @param zodError {zod.ZodError}
 * @return {ValidationError}
 */
export function fromZodError(zodError: zod.ZodError): ValidationError {
  const reason = zodError.errors
    // limit max number of issues printed in the reason section
    .slice(0, MAX_ISSUES_IN_REASON)
    // format error message
    .map((issue) => {
      const { message, path } = issue;

      if (path.length > 0) {
        return message + ' at "' + joinPath(path) + '"';
      }

      return message;
    })
    // concat as string
    .join('; ');

  const message = reason ? [PREFIX_COPY, reason].join(': ') : PREFIX_COPY;

  return new ValidationError(message, {
    details: zodError.errors,
  });
}

export function toValidationError(err: unknown): ValidationError | Error {
  if (err instanceof zod.ZodError) {
    return fromZodError(err);
  }

  if (err instanceof Error) {
    return err;
  }

  return new Error('Unknown error');
}

export function isValidationError(err: unknown): err is ValidationError {
  return err instanceof ValidationError;
}
