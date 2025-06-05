import { type NonEmptyArray } from '../utils/NonEmptyArray.ts';
import { titleCase } from '../utils/titleCase.ts';
import { defaultErrorMapOptions } from './errorMap/index.ts';
import type * as zod from 'zod/v4/core';

export type ZodIssue = zod.$ZodIssue;

export type MessageBuilder = (issues: NonEmptyArray<ZodIssue>) => string;

const stubErrorMap: zod.$ZodErrorMap<zod.$ZodIssue> = (issue) => {
  return issue.message;
};

export type MessageBuilderOptions = {
  prefix: string | null | undefined;
  prefixSeparator: string;
  maxIssuesInMessage: number;
  issueSeparator: string;
  issuesInTitleCase: boolean;
  error: zod.$ZodErrorMap<zod.$ZodIssue>;
};

export const defaultMessageBuilderOptions: MessageBuilderOptions & {
  prefix: string;
} = {
  prefix: 'Validation error',
  prefixSeparator: ': ',
  maxIssuesInMessage: 99, // I've got 99 problems but the b$tch ain't one
  issueSeparator: defaultErrorMapOptions.issueSeparator,
  issuesInTitleCase: defaultErrorMapOptions.issuesInTitleCase,
  error: stubErrorMap,
};

export function createMessageBuilder(
  partialOptions: Partial<MessageBuilderOptions> = {}
): MessageBuilder {
  const options = {
    ...defaultMessageBuilderOptions,
    ...partialOptions,
  };
  const errorMap = options.error;

  return function messageBuilder(issues) {
    const message = issues
      // limit max number of issues printed in the reason section
      .slice(0, options.maxIssuesInMessage)
      // format error message
      .map((issue) => {
        const message = errorMap(issue);

        if (options.issuesInTitleCase) {
          if (message == null) {
            return message;
          }

          if (typeof message === 'string') {
            return titleCase(message);
          }

          return titleCase(message.message);
        }

        return message;
      })
      // concat as string
      .join(options.issueSeparator);

    return conditionallyPrefixMessage(message, options);
  };
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
