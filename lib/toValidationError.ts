import { ValidationError } from './ValidationError.ts';
import { isZodErrorLike } from './isZodErrorLike.ts';
import {
  fromZodErrorWithoutRuntimeCheck,
  type fromZodError,
} from './fromZodError.ts';

export const toValidationError =
  (options: Parameters<typeof fromZodError>[1] = {}) =>
  (err: unknown): ValidationError => {
    if (isZodErrorLike(err)) {
      return fromZodErrorWithoutRuntimeCheck(err, options);
    }

    if (err instanceof Error) {
      return new ValidationError(err.message, { cause: err });
    }

    return new ValidationError('Unknown error');
  };
