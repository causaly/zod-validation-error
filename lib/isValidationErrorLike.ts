import { ValidationError } from './ValidationError';

export function isValidationErrorLike(err: unknown): err is ValidationError {
  return err instanceof Error && err.name === 'ZodValidationError';
}
