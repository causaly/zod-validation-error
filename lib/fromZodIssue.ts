import * as zod from 'zod';

import {
  ISSUE_SEPARATOR,
  PREFIX,
  PREFIX_SEPARATOR,
  UNION_SEPARATOR,
} from './config.ts';
import { prefixMessage } from './prefixMessage.ts';
import { joinPath } from './utils/joinPath.ts';
import { isNonEmptyArray } from './utils/NonEmptyArray.ts';
import { ValidationError } from './ValidationError.ts';

export type ZodIssue = zod.ZodIssue;

export function getMessageFromZodIssue(props: {
  issue: ZodIssue;
  issueSeparator: string;
  unionSeparator: string;
  includePath: boolean;
}): string {
  const { issue, issueSeparator, unionSeparator, includePath } = props;

  if (issue.code === 'invalid_union') {
    return issue.unionErrors
      .reduce<string[]>((acc, zodError) => {
        const newIssues = zodError.issues
          .map((issue) =>
            getMessageFromZodIssue({
              issue,
              issueSeparator,
              unionSeparator,
              includePath,
            })
          )
          .join(issueSeparator);

        if (!acc.includes(newIssues)) {
          acc.push(newIssues);
        }

        return acc;
      }, [])
      .join(unionSeparator);
  }

  if (issue.code === 'invalid_arguments') {
    return [
      issue.message,
      ...issue.argumentsError.issues.map((issue) =>
        getMessageFromZodIssue({
          issue,
          issueSeparator,
          unionSeparator,
          includePath,
        })
      ),
    ].join(issueSeparator);
  }

  if (issue.code === 'invalid_return_type') {
    return [
      issue.message,
      ...issue.returnTypeError.issues.map((issue) =>
        getMessageFromZodIssue({
          issue,
          issueSeparator,
          unionSeparator,
          includePath,
        })
      ),
    ].join(issueSeparator);
  }

  if (includePath && isNonEmptyArray(issue.path)) {
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

export type FromZodIssueOptions = {
  issueSeparator?: string;
  unionSeparator?: string;
  prefix?: string | null;
  prefixSeparator?: string;
  includePath?: boolean;
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
    includePath = true,
  } = options;

  const reason = getMessageFromZodIssue({
    issue,
    issueSeparator,
    unionSeparator,
    includePath,
  });
  const message = prefixMessage(reason, prefix, prefixSeparator);

  return new ValidationError(message, { cause: new zod.ZodError([issue]) });
}
