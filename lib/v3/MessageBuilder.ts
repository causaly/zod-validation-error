import * as zod from 'zod';
import { type NonEmptyArray, isNonEmptyArray } from '../utils/NonEmptyArray.ts';
import { joinPath } from '../utils/joinPath.ts';
import {
  ISSUE_SEPARATOR,
  MAX_ISSUES_IN_MESSAGE,
  PREFIX,
  PREFIX_SEPARATOR,
  UNION_SEPARATOR,
} from './config.ts';

export type ZodIssue = zod.ZodIssue;

export type MessageBuilder = (issues: NonEmptyArray<ZodIssue>) => string;

export type CreateMessageBuilderProps = {
  issueSeparator?: string;
  unionSeparator?: string;
  prefix?: string | null;
  prefixSeparator?: string;
  includePath?: boolean;
  maxIssuesInMessage?: number;
};

export function createMessageBuilder(
  props: CreateMessageBuilderProps = {}
): MessageBuilder {
  const {
    issueSeparator = ISSUE_SEPARATOR,
    unionSeparator = UNION_SEPARATOR,
    prefixSeparator = PREFIX_SEPARATOR,
    prefix = PREFIX,
    includePath = true,
    maxIssuesInMessage = MAX_ISSUES_IN_MESSAGE,
  } = props;
  return (issues) => {
    const message = issues
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

    return prefixMessage(message, prefix, prefixSeparator);
  };
}

function getMessageFromZodIssue(props: {
  issue: ZodIssue;
  issueSeparator: string;
  unionSeparator: string;
  includePath: boolean;
}): string {
  const { issue, issueSeparator, unionSeparator, includePath } = props;

  if (issue.code === zod.ZodIssueCode.invalid_union) {
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

  if (issue.code === zod.ZodIssueCode.invalid_arguments) {
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

  if (issue.code === zod.ZodIssueCode.invalid_return_type) {
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

function prefixMessage(
  message: string,
  prefix: string | null,
  prefixSeparator: string
): string {
  if (prefix !== null) {
    if (message.length > 0) {
      return [prefix, message].join(prefixSeparator);
    }

    return prefix;
  }

  if (message.length > 0) {
    return message;
  }

  // if both reason and prefix are empty, return default prefix
  // to avoid having an empty error message
  return PREFIX;
}
