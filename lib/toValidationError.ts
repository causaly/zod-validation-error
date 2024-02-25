import * as zod from 'zod';

import { fromZodError } from './fromZodError.ts';
import { ValidationError } from './ValidationError.ts';

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
