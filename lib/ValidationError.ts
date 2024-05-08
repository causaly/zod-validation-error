import { isZodErrorLike } from './isZodErrorLike.ts';
import type * as zod from 'zod';

// make zod-validation-error compatible with
// earlier to es2022 typescript configurations
// @see https://github.com/causaly/zod-validation-error/issues/226
export interface ErrorOptions {
  cause?: unknown;
}

export class ValidationError extends Error {
  name: 'ZodValidationError';
  details: Array<zod.ZodIssue>;

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ZodValidationError';
    this.details = getIssuesFromErrorOptions(options);
  }

  toString(): string {
    return this.message;
  }
}

function getIssuesFromErrorOptions(
  options?: ErrorOptions
): Array<zod.ZodIssue> {
  if (options) {
    const cause = options.cause;

    if (isZodErrorLike(cause)) {
      return cause.issues;
    }
  }

  return [];
}
