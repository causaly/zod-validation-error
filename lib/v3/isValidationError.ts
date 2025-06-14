import { ValidationError } from './ValidationError.ts';

export function isValidationError(err: unknown): err is ValidationError {
  return err instanceof ValidationError;
}
