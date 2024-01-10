import { ValidationError } from './ValidationError';

export function isValidationError(err: unknown): err is ValidationError {
  return err instanceof ValidationError;
}
