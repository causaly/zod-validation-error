import { ValidationError } from './ValidationError.ts';
import { isZodErrorLike } from './isZodErrorLike.ts';
import {
  fromZodErrorWithoutRuntimeCheck,
  type FromZodErrorOptions,
} from './fromZodError.ts';

export const toValidationError =
  (options: FromZodErrorOptions = {}) =>
  (err: unknown): ValidationError => {
    if (isZodErrorLike(err)) {
      return fromZodErrorWithoutRuntimeCheck(err, options);
    }

    if (err instanceof Error) {
      return new ValidationError(err.message, { cause: err });
    }

    return new ValidationError('Unknown error');
  };
