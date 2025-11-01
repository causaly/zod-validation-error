import { isNonEmptyArray } from '../utils/NonEmptyArray.ts';
import { fromError } from './fromError.ts';
import { isZodErrorLike } from './isZodErrorLike.ts';
import {
  createMessageBuilder,
  type CreateMessageBuilderProps,
  type MessageBuilder,
} from './MessageBuilder.ts';
import { ValidationError } from './ValidationError.ts';
import type * as zod from 'zod';

export type ZodError = zod.ZodError;

export type FromZodErrorOptions =
  | {
      messageBuilder: MessageBuilder;
    }
  // maintain backwards compatibility
  | CreateMessageBuilderProps;

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
  const zodIssues = zodError.errors;

  let message: string;
  if (isNonEmptyArray(zodIssues)) {
    const messageBuilder = createMessageBuilderFromOptions(options);
    message = messageBuilder(zodIssues);
  } else {
    message = zodError.message;
  }

  return new ValidationError(message, { cause: zodError });
}

function createMessageBuilderFromOptions(
  options: FromZodErrorOptions
): MessageBuilder {
  if ('messageBuilder' in options) {
    return options.messageBuilder;
  }

  return createMessageBuilder(options);
}
