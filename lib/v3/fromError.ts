import { toValidationError } from './toValidationError.ts';
import type { FromZodErrorOptions } from './fromZodError.ts';
import type { ValidationError } from './ValidationError.ts';

/**
 * This function is a non-curried version of `toValidationError`
 */
export function fromError(
  err: unknown,
  options: FromZodErrorOptions = {}
): ValidationError {
  return toValidationError(options)(err);
}
