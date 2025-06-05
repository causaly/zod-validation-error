import * as zod from 'zod/v4/core';

import {
  type MessageBuilder,
  type MessageBuilderOptions,
  type ZodIssue,
  createMessageBuilder,
} from './MessageBuilder.ts';
import { ValidationError } from './ValidationError.ts';

export type FromZodIssueOptions =
  | {
      messageBuilder: MessageBuilder;
    }
  // maintain backwards compatibility
  | Partial<Omit<MessageBuilderOptions, 'maxIssuesInMessage'>>;

export function fromZodIssue(
  issue: ZodIssue,
  options: FromZodIssueOptions = {}
): ValidationError {
  const messageBuilder = createMessageBuilderFromOptions(options);
  const message = messageBuilder([issue]);

  return new ValidationError(message, {
    cause: new zod.$ZodRealError([issue]),
  });
}

function createMessageBuilderFromOptions(
  options: FromZodIssueOptions
): MessageBuilder {
  if ('messageBuilder' in options) {
    return options.messageBuilder;
  }

  return createMessageBuilder(options);
}
