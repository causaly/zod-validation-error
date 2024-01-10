import * as zod from 'zod';

import { fromZodError } from './fromZodError';
import { ValidationError } from './ValidationError';

export const toValidationError =
  (options: Parameters<typeof fromZodError>[1] = {}) =>
  (err: unknown): ValidationError => {
    if (err instanceof zod.ZodError) {
      return fromZodError(err, options);
    }

    if (err instanceof Error) {
      return new ValidationError(err.message, { cause: err });
    }

    return new ValidationError('Unknown error');
  };
