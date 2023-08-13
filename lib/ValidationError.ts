import * as zod from 'zod';

import { joinPath } from './utils/joinPath';
import { isNonEmptyArray } from './utils/NonEmptyArray';

const MAX_ISSUES_IN_MESSAGE = 99; // I've got 99 problems but the b$tch ain't one
const ISSUE_SEPARATOR = '; ';
const UNION_SEPARATOR = ', or ';
const PREFIX = 'Validation error';
const PREFIX_SEPARATOR = ': ';

export type ZodError = zod.ZodError;
export type ZodIssue = zod.ZodIssue;

export class ValidationError extends Error {
  details: Array<zod.ZodIssue>;
  name: 'ZodValidationError';

  constructor(message: string, details: Array<zod.ZodIssue> | undefined = []) {
    super(message);
    this.details = details;
    this.name = 'ZodValidationError';
  }

  toString(): string {
    return this.message;
  }
}

function getMessageFromZodIssue(
  issue: ZodIssue,
  issueSeparator: string,
  unionSeparator: string
): string {
  if (issue.code === 'invalid_union') {
    return issue.unionErrors
      .reduce<string[]>((acc, zodError) => {
        const newIssues = zodError.issues
          .map((issue) =>
            getMessageFromZodIssue(issue, issueSeparator, unionSeparator)
          )
          .join(issueSeparator);

        if (!acc.includes(newIssues)) {
          acc.push(newIssues);
        }

        return acc;
      }, [])
      .join(unionSeparator);
  }

  if (isNonEmptyArray(issue.path)) {
    // handle array indices
    if (issue.path.length === 1) {
      const identifier = issue.path[0];

      if (typeof identifier === 'number') {
        return `${issue.message} at index ${identifier}`;
      }
    }

    return `${issue.message} at "${joinPath(issue.path)}"`;
  }

  return issue.message;
}

function conditionallyPrefixMessage(
  reason: string,
  prefix: string | null,
  prefixSeparator: string
): string {
  if (prefix !== null) {
    if (reason.length > 0) {
      return [prefix, reason].join(prefixSeparator);
    }

    return prefix;
  }

  if (reason.length > 0) {
    return reason;
  }

  // if both reason and prefix are empty, return default prefix
  // to avoid having an empty error message
  return PREFIX;
}

export type FromZodIssueOptions = {
  issueSeparator?: string;
  unionSeparator?: string;
  prefix?: string | null;
  prefixSeparator?: string;
};

export function fromZodIssue(
  issue: ZodIssue,
  options: FromZodIssueOptions = {}
): ValidationError {
  const {
    issueSeparator = ISSUE_SEPARATOR,
    unionSeparator = UNION_SEPARATOR,
    prefixSeparator = PREFIX_SEPARATOR,
    prefix = PREFIX,
  } = options;

  const reason = getMessageFromZodIssue(issue, issueSeparator, unionSeparator);
  const message = conditionallyPrefixMessage(reason, prefix, prefixSeparator);

  return new ValidationError(message, [issue]);
}

export type FromZodErrorOptions = FromZodIssueOptions & {
  maxIssuesInMessage?: number;
};

export function fromZodError(
  zodError: ZodError,
  options: FromZodErrorOptions = {}
): ValidationError {
  const {
    maxIssuesInMessage = MAX_ISSUES_IN_MESSAGE,
    issueSeparator = ISSUE_SEPARATOR,
    unionSeparator = UNION_SEPARATOR,
    prefixSeparator = PREFIX_SEPARATOR,
    prefix = PREFIX,
  } = options;

  const reason = zodError.errors
    // limit max number of issues printed in the reason section
    .slice(0, maxIssuesInMessage)
    // format error message
    .map((issue) =>
      getMessageFromZodIssue(issue, issueSeparator, unionSeparator)
    )
    // concat as string
    .join(issueSeparator);

  const message = conditionallyPrefixMessage(reason, prefix, prefixSeparator);

  return new ValidationError(message, zodError.errors);
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
