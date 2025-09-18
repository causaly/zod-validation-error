import { joinPath } from '../utils/joinPath.ts';
import { isNonEmptyArray, type NonEmptyArray } from '../utils/NonEmptyArray.ts';
import { titleCase } from '../utils/titleCase.ts';
import type * as zod from 'zod/v4/core';

export type ZodIssue = zod.$ZodIssue;

export type MessageBuilder = (issues: NonEmptyArray<ZodIssue>) => string;

export type MessageBuilderOptions = {
  prefix: string | null | undefined;
  prefixSeparator: string;
  maxIssuesInMessage: number;
  issueSeparator: string;
  unionSeparator: string;
  includePath: boolean;
  forceTitleCase: boolean;
};

export const defaultMessageBuilderOptions: MessageBuilderOptions & {
  prefix: string;
} = {
  prefix: 'Validation error',
  prefixSeparator: ': ',
  maxIssuesInMessage: 99, // I've got 99 problems but the b$tch ain't one
  unionSeparator: ' or ',
  issueSeparator: '; ',
  includePath: true,
  forceTitleCase: true,
};

export function createMessageBuilder(
  partialOptions: Partial<MessageBuilderOptions> = {}
): MessageBuilder {
  const options = {
    ...defaultMessageBuilderOptions,
    ...partialOptions,
  };

  return function messageBuilder(issues) {
    const message = issues
      // limit max number of issues printed in the reason section
      .slice(0, options.maxIssuesInMessage)
      // format error message
      .map((issue) => mapIssue(issue, options))
      // concat as string
      .join(options.issueSeparator);

    return conditionallyPrefixMessage(message, options);
  };
}

function mapIssue(
  issue: zod.$ZodIssue,
  options: MessageBuilderOptions
): string {
  if (issue.code === 'invalid_union' && isNonEmptyArray(issue.errors)) {
    const individualMessages = issue.errors.map((issues) =>
      issues
        .map((subIssue) =>
          mapIssue(
            {
              ...subIssue,
              path: issue.path.concat(subIssue.path),
            },
            options
          )
        )
        .join(options.issueSeparator)
    );

    // deduplicate messages
    // and join them with the union separator
    // to create a single message for the invalid union issue
    return Array.from(new Set(individualMessages)).join(options.unionSeparator);
  }

  const buf = [];

  if (options.forceTitleCase) {
    buf.push(titleCase(issue.message));
  } else {
    buf.push(issue.message);
  }

  pathCondition: if (
    options.includePath &&
    issue.path !== undefined &&
    isNonEmptyArray(issue.path)
  ) {
    // handle array indices
    if (issue.path.length === 1) {
      const identifier = issue.path[0];

      if (typeof identifier === 'number') {
        buf.push(` at index ${identifier}`);
        break pathCondition;
      }
    }

    buf.push(` at "${joinPath(issue.path)}"`);
  }

  return buf.join('');
}

function conditionallyPrefixMessage(
  message: string,
  options: Pick<MessageBuilderOptions, 'prefix' | 'prefixSeparator'>
): string {
  if (options.prefix != null) {
    if (message.length > 0) {
      return [options.prefix, message].join(options.prefixSeparator);
    }

    return options.prefix;
  }

  if (message.length > 0) {
    return message;
  }

  // if both reason and prefix are empty, return default prefix
  // to avoid having an empty error message
  return defaultMessageBuilderOptions.prefix;
}
