import * as zod from 'zod/v3';

import {
  type MessageBuilder,
  type CreateMessageBuilderProps,
  type ZodIssue,
  createMessageBuilder,
} from './MessageBuilder.ts';
import { ValidationError } from './ValidationError.ts';

export type FromZodIssueOptions =
  | {
      messageBuilder: MessageBuilder;
    }
  // maintain backwards compatibility
  | Omit<CreateMessageBuilderProps, 'maxIssuesInMessage'>;

export function fromZodIssue(
  issue: ZodIssue,
  options: FromZodIssueOptions = {}
): ValidationError {
  const messageBuilder = createMessageBuilderFromOptions(options);
  const message = messageBuilder([issue]);

  return new ValidationError(message, { cause: new zod.ZodError([issue]) });
}

function createMessageBuilderFromOptions(
  options: FromZodIssueOptions
): MessageBuilder {
  if ('messageBuilder' in options) {
    return options.messageBuilder;
  }

  return createMessageBuilder(options);
}
