# zod-validation-error

Wrap zod validation errors in user-friendly readable messages.

[![Build Status](https://github.com/causaly/zod-validation-error/actions/workflows/ci.yml/badge.svg)](https://github.com/causaly/zod-validation-error/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/zod-validation-error.svg?color=0c0)](https://www.npmjs.com/package/zod-validation-error)

#### Features

- User-friendly readable messages, configurable via options;
- Maintain original errors under `error.details`;
- Extensive tests.

## Installation

```bash
npm install zod-validation-error
```

#### Requirements

- Node.js v.16+

## Quick start

```typescript
import { z as zod } from 'zod';
import { fromZodError } from 'zod-validation-error';

// create zod schema
const zodSchema = zod.object({
  id: zod.number().int().positive(),
  email: zod.string().email(),
});

// parse some invalid value
try {
  zodSchema.parse({
    id: 1,
    email: 'foobar', // note: invalid email
  });
} catch (err) {
  const validationError = fromZodError(err);
  // the error now is readable by the user
  // you may print it to console
  // or return it via an API
  console.log(validationError);
}
```

## Motivation

Zod errors are difficult to consume for the end-user. This library wraps Zod validation errors in user-friendly readable messages that can be exposed to the outer world, while maintaining the original errors in an array for _dev_ use.

### Example

#### Input (from Zod)

```json
[
  {
    "code": "too_small",
    "inclusive": false,
    "message": "Number must be greater than 0",
    "minimum": 0,
    "path": ["id"],
    "type": "number"
  },
  {
    "code": "invalid_string",
    "message": "Invalid email",
    "path": ["email"],
    "validation": "email"
  }
]
```

#### Output

```
Validation error: Number must be greater than 0 at "id"; Invalid email at "email"
```

## API

- [ValidationError(message[, details])](#validationerror)
- [isValidationError(error)](#isvalidationerror)
- [isValidationErrorLike(error)](#isvalidationerrorlike)
- [fromZodError(zodError[, options])](#fromzoderror)
- [toValidationError([options]) => (error) => ValidationError](#tovalidationerror)

### ValidationError

Main `ValidationError` class, extending native JavaScript `Error`.

#### Arguments

- `message` - _string_; error message (required)
- `details` - _Array<Zod.ZodIssue>_; error details (optional)

#### Example

```typescript
const { ValidationError } = require('zod-validation-error');

const error = new ValidationError('foobar');
console.log(error instanceof Error); // prints true
```

### isValidationError

A [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) utility function, based on `instanceof` comparison.

#### Arguments

- `error` - error instance (required)

#### Example

```typescript
import { ValidationError, isValidationError } from 'zod-validation-error';

const err = new ValidationError('foobar', { details: [] });
isValidationError(err); // returns true

const invalidErr = new Error('foobar');
isValidationError(err); // returns false
```

### isValidationErrorLike

A [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) utility function, based on heuristics comparison.

Why do we need heuristics if we have `instanceof` comparison? Because of multi-version inconsistencies. For instance, it's possible that a dependency is using an older `zod-validation-error` version internally. In such case, the `instanceof` comparison will yield invalid results because module deduplication does not apply at npm/yarn level and the prototype is different.

In most cases, it is safer to use `isValidationErrorLike` than `isValidationError`.

#### Arguments

- `error` - error instance (required)

#### Example

```typescript
import { ValidationError, isValidationErrorLike } from 'zod-validation-error';

const err = new ValidationError('foobar', { details: [] });
isValidationErrorLike(err); // returns true

const invalidErr = new Error('foobar');
isValidationErrorLike(err); // returns false
```

### fromZodError

Converts zod error to `ValidationError`.

#### Arguments

- `zodError` - _zod.ZodError_; a ZodError instance (required)
- `options` - _Object_; formatting options (optional)
  - `maxIssuesInMessage` - _number_; max issues to include in user-friendly message (optional, defaults to `99`)
  - `issueSeparator` - _string_; used to concatenate issues in user-friendly message (optional, defaults to `;`)
  - `unionSeparator` - _string_; used to concatenate union-issues in user-friendly message (optional, defaults to `, or`)
  - `prefix` - _string_; prefix in user-friendly message (optional, defaults to `Validation error`)
  - `prefixSeparator` - _string_; used to concatenate prefix with rest of the user-friendly message (optional, defaults to `: `)

### toValidationError

A curried version of `fromZodError` meant to be used for FP (Functional Programming). Note it first takes the options object if needed and returns a function that converts the `zodError` to a `ValidationError` object

```js
toValidationError(options) => (zodError) => ValidationError
```

#### Example using fp-ts

```typescript
import * as Either from 'fp-ts/Either';
import { z as zod } from 'zod';
import { toValidationError } from 'zod-validation-error';

// create zod schema
const zodSchema = zod
  .object({
    id: zod.number().int().positive(),
    email: zod.string().email(),
  })
  .brand<'User'>();

export type User = zod.infer<typeof zodSchema>;

export function parse(
  value: zod.input<typeof zodSchema>
): Either.Either<Error, User> {
  return Either.tryCatch(() => schema.parse(value), toValidationError());
}
```

## FAQ

### How to distinguish between errors

Use the `isValidationErrorLike` type guard.

#### Example

Scenario: Distinguish between `ValidationError` VS generic `Error` in order to respond with 400 VS 500 HTTP status code respectively.

```typescript
import * as Either from 'fp-ts/Either';
import { z as zod } from 'zod';
import { isValidationErrorLike } from 'zod-validation-error';

try {
  func(); // throws Error - or - ValidationError
} catch (err) {
  if (isValidationErrorLike(err)) {
    return 400; // Bad Data (this is a client error)
  }

  return 500; // Server Error
}
```

### How to use `ValidationError` outside `zod`

It's possible to implement custom validation logic outside `zod` and throw a `ValidationError`.

#### Example

```typescript
import { ValidationError } from 'zod-validation-error';
import { Buffer } from 'node:buffer';

function parseBuffer(buf: unknown): Buffer {
  if (!Buffer.isBuffer(buf)) {
    throw new ValidationError('Invalid argument; expected buffer');
  }

  return buf;
}
```

### Does `zod-validation-error` support CommonJS

Yes, `zod-validation-error` supports CommonJS out-of-the-box. All you need to do is import it using `require`.

#### Example

```typescript
const { ValidationError } = require('zod-validation-error');
```

## Contribute

Source code contributions are most welcome. Please open a PR, ensure the linter is satisfied and all tests pass.

#### We are hiring

Causaly is building the world's largest biomedical knowledge platform, using technologies such as TypeScript, React and Node.js. Find out more about our openings at https://apply.workable.com/causaly/.

## License

MIT
