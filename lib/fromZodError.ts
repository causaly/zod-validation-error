import * as zod from 'zod';

import {
  ISSUE_SEPARATOR,
  MAX_ISSUES_IN_MESSAGE,
  PREFIX,
  PREFIX_SEPARATOR,
  UNION_SEPARATOR,
} from './config';
import {
  conditionallyPrefixMessage,
  FromZodIssueOptions,
  getMessageFromZodIssue,
} from './fromZodIssue';
import { ValidationError } from './ValidationError';

export type ZodError = zod.ZodError;

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

  const message = conditionallyPrefixMessage(reason, prefix, prefixSeparator);

  return new ValidationError(message, { cause: zodError });
}
