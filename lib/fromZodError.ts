import {
  ISSUE_SEPARATOR,
  MAX_ISSUES_IN_MESSAGE,
  PREFIX,
  PREFIX_SEPARATOR,
  UNION_SEPARATOR,
} from './config.ts';
import { getMessageFromZodIssue } from './fromZodIssue.ts';
import { prefixMessage } from './prefixMessage.ts';
import { ValidationError } from './ValidationError.ts';
import { fromError } from './fromError.ts';
import { isZodErrorLike } from './isZodErrorLike.ts';
import type * as zod from 'zod';
import type { FromZodIssueOptions } from './fromZodIssue.ts';

export type ZodError = zod.ZodError;

export type FromZodErrorOptions = FromZodIssueOptions & {
  maxIssuesInMessage?: number;
};

export function fromZodError(
  zodError: ZodError,
  options: FromZodErrorOptions = {}
): ValidationError {
  // perform runtime check to ensure the input is a ZodError
  // why? because people have been historically using this function incorrectly
  if (!isZodErrorLike(zodError)) {
    throw new TypeError(
      `Invalid zodError param; expected instance of ZodError. Did you mean to use the "${fromError.name}" method instead?`
    );
  }

  return fromZodErrorWithoutRuntimeCheck(zodError, options);
}

export function fromZodErrorWithoutRuntimeCheck(
  zodError: ZodError,
  options: FromZodErrorOptions = {}
): ValidationError {
  const {
    maxIssuesInMessage = MAX_ISSUES_IN_MESSAGE,
    issueSeparator = ISSUE_SEPARATOR,
    unionSeparator = UNION_SEPARATOR,
    prefixSeparator = PREFIX_SEPARATOR,
    prefix = PREFIX,
    includePath = true,
  } = options;

  const zodIssues = zodError.errors;

  const reason =
    zodIssues.length === 0
      ? zodError.message
      : zodIssues
          // limit max number of issues printed in the reason section
          .slice(0, maxIssuesInMessage)
          // format error message
          .map((issue) =>
            getMessageFromZodIssue({
              issue,
              issueSeparator,
              unionSeparator,
              includePath,
            })
          )
          // concat as string
          .join(issueSeparator);

  const message = prefixMessage(reason, prefix, prefixSeparator);

  return new ValidationError(message, { cause: zodError });
}
