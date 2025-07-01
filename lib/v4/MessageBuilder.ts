import * as zod from 'zod/v4/core';
import { type NonEmptyArray } from '../utils/NonEmptyArray.ts';
import {
  defaultErrorMap,
  defaultErrorMapOptions,
  isZodValidationErrorMap,
} from './errorMap/index.ts';

export type ZodIssue = zod.$ZodIssue;

export type MessageBuilder = (issues: NonEmptyArray<ZodIssue>) => string;

const identityErrorMap: zod.$ZodErrorMap<zod.$ZodIssue> = (issue) => {
  return issue.message;
};

export type MessageBuilderOptions = {
  prefix: string | null | undefined;
  prefixSeparator: string;
  maxIssuesInMessage: number;
  issueSeparator: string;
  error: zod.$ZodErrorMap<zod.$ZodIssue> | false;
};

export const defaultMessageBuilderOptions: MessageBuilderOptions & {
  prefix: string;
} = {
  prefix: 'Validation error',
  prefixSeparator: ': ',
  maxIssuesInMessage: 99, // I've got 99 problems but the b$tch ain't one
  issueSeparator: defaultErrorMapOptions.issueSeparator,
  error: defaultErrorMap,
};

export function createMessageBuilder(
  partialOptions: Partial<MessageBuilderOptions> = {}
): MessageBuilder {
  const options = {
    ...defaultMessageBuilderOptions,
    ...partialOptions,
  };
  const errorMap =
    // user requested not to format errors by explicitly setting error to false
    options.error === false ||
    // we have already formatted errors with zod-validation-error
    // using the zod.config() API
    // thus we should not format them again for performance reasons
    (partialOptions.error === undefined &&
      zod.globalConfig.customError !== undefined &&
      isZodValidationErrorMap(zod.globalConfig.customError))
      ? identityErrorMap
      : options.error;

  return function messageBuilder(issues) {
    const message = issues
      // limit max number of issues printed in the reason section
      .slice(0, options.maxIssuesInMessage)
      // format error message
      .map(errorMap)
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
