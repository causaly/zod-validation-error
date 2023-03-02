import * as zod from 'zod';

import { joinPath } from './utils/joinPath';

export class ValidationError extends Error {
  details: Array<Zod.ZodIssue>;
  name: 'ZodValidationError';

  constructor(
    message: string,
    options?: {
      details: Array<Zod.ZodIssue>;
    }
  ) {
    super(message);
    this.details = options?.details ?? [];
    this.name = 'ZodValidationError';
  }

  toString(): string {
    return this.message;
  }
}

function fromZodIssue(
  issue: zod.ZodIssue,
  issueSeparator: string,
  unionSeparator: string
): string {
  if (issue.code === 'invalid_union') {
    return issue.unionErrors
      .reduce<string[]>((acc, zodError) => {
        const newIssues = zodError.issues
          .map((issue) => fromZodIssue(issue, issueSeparator, unionSeparator))
          .join(issueSeparator);

        if (!acc.includes(newIssues)) {
          acc.push(newIssues);
        }

        return acc;
      }, [])
      .join(unionSeparator);
  }

  if (issue.path.length > 0) {
    return `${issue.message} at "${joinPath(issue.path)}"`;
  }

  return issue.message;
}

export function fromZodError(
  zodError: zod.ZodError,
  options: {
    maxIssuesInMessage?: number;
    issueSeparator?: string;
    unionSeparator?: string;
    prefixSeparator?: string;
    prefix?: string;
  } = {}
): ValidationError {
  const {
    maxIssuesInMessage = 99, // I've got 99 problems but the b$tch ain't one
    issueSeparator = '; ',
    unionSeparator = ', or ',
    prefixSeparator = ': ',
    prefix = 'Validation error',
  } = options;

  const reason = zodError.errors
    // limit max number of issues printed in the reason section
    .slice(0, maxIssuesInMessage)
    // format error message
    .map((issue) => fromZodIssue(issue, issueSeparator, unionSeparator))
    // concat as string
    .join(issueSeparator);

  const message = reason ? [prefix, reason].join(prefixSeparator) : prefix;

  return new ValidationError(message, {
    details: zodError.errors,
  });
}

export const toValidationError =
  (options: Parameters<typeof fromZodError>[1] = {}) =>
  (err: unknown): ValidationError | Error => {
    if (err instanceof zod.ZodError) {
      return fromZodError(err, options);
    }

    if (err instanceof Error) {
      return err;
    }

    return new Error('Unknown error');
  };

export function isValidationError(err: unknown): err is ValidationError {
  return err instanceof ValidationError;
}

export function isValidationErrorLike(err: unknown): err is ValidationError {
  return err instanceof Error && err.name === 'ZodValidationError';
}
