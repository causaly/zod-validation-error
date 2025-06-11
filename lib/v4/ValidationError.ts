import { isZodErrorLike } from './isZodErrorLike.ts';
import type * as zod from 'zod/v4/core';

export const ZOD_VALIDATION_ERROR_NAME = 'ZodValidationError';

// make zod-validation-error compatible with
// earlier to es2022 typescript configurations
// @see https://github.com/causaly/zod-validation-error/issues/226
export interface ErrorOptions {
  cause?: unknown;
}

export class ValidationError extends Error {
  name: typeof ZOD_VALIDATION_ERROR_NAME;
  details: Array<zod.$ZodIssue>;

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = ZOD_VALIDATION_ERROR_NAME;
    this.details = getIssuesFromErrorOptions(options);
  }

  toString(): string {
    return this.message;
  }
}

function getIssuesFromErrorOptions(
  options?: ErrorOptions
): Array<zod.$ZodIssue> {
  if (options) {
    const cause = options.cause;
    if (isZodErrorLike(cause)) {
      return cause.issues;
    }
  }

  return [];
}
