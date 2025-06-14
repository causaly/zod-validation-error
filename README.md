# zod-validation-error

Wrap zod validation errors in user-friendly readable messages.

[![Build Status](https://github.com/causaly/zod-validation-error/actions/workflows/ci.yml/badge.svg)](https://github.com/causaly/zod-validation-error/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/zod-validation-error.svg?color=0c0)](https://www.npmjs.com/package/zod-validation-error)

#### Features

- User-friendly readable error messages with extensive configuration options;
- Preserves original error details accessible via `error.details`;
- Provides a custom error map for automatic message formatting;
- Supports both Zod v3 and v4.

**_Note:_** This is the v4 version of `zod-validation-error`. If you are looking for the zod v3 support, please click [here](./README.v3.md)

## Installation

```bash
npm install zod-validation-error
```

#### Requirements

- Node.js v.18+
- TypeScript v.4.5+

## Quick start

```typescript
import { z as zod } from 'zod/v4';
import { fromError, createErrorMap } from 'zod-validation-error/v4';

// use custom error map to automatically format messages
// this is optional, but recommended
// without this, zod's native error messages will be used
zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

// create zod schema
const zodSchema = zod.object({
  id: zod.int().positive(),
  email: zod.email(),
});

// parse some invalid value
try {
  zodSchema.parse({
    id: 1,
    email: 'coyote@acme', // note: invalid email
  });
} catch (err) {
  const validationError = fromError(err);
  // the error is now readable by the user
  // you may print it to console
  console.log(validationError.toString());
  // or return it as an actual error
  return validationError;
}
```

<details>
<summary>Per-format error customization</summary>

For more fine-grained control over the error messages, you may pass the error map as an option to the `fromError` function.

```typescript
import { z as zod } from 'zod/v4';
import { fromError, createErrorMap } from 'zod-validation-error/v4';

// create zod schema
const zodSchema = zod.object({
  id: zod.int().positive(),
  email: zod.email(),
});

// parse some invalid value
try {
  zodSchema.parse({
    id: 1,
    email: 'coyote@acme', // note: invalid email
  });
} catch (err) {
  // create custom error map
  // this is optional, but recommended
  // without this, zod's native error messages will be used
  // and the error will not be user-friendly
  const errorMap = createErrorMap({
    includePath: false,
  });

  const validationError = fromError(err, {
    error: errorMap,
  });
  // the error is now readable by the user
  // you may print it to console
  console.log(validationError.toString());
  // or return it as an actual error
  return validationError;
}
```

</details>

## Motivation

Zod errors are difficult to consume for the end-user. This library wraps Zod validation errors in user-friendly readable messages that can be exposed to the outer world, while maintaining the original errors in an array for _dev_ use.

### Example

#### Input (from Zod)

```json
[
  {
    "origin": "number",
    "code": "too_small",
    "minimum": 0,
    "inclusive": false,
    "path": ["id"],
    "message": "Number must be greater than 0 at \"id\""
  },
  {
    "origin": "string",
    "code": "invalid_format",
    "format": "email",
    "pattern": "/^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$/",
    "path": ["email"],
    "message": "Invalid email at \"email\""
  }
]
```

#### Output

```
Validation error: Number must be greater than 0 at "id"; Invalid email at "email"
```

## API

- [ValidationError(message[, options])](#validationerror)
- [createErrorMap(options)](#createErrorMap)
- [createMessageBuilder(options)](#createMessageBuilder)
- [isValidationError(error)](#isvalidationerror)
- [isValidationErrorLike(error)](#isvalidationerrorlike)
- [isZodErrorLike(error)](#iszoderrorlike)
- [fromError(error[, options])](#fromerror)
- [fromZodIssue(zodIssue[, options])](#fromzodissue)
- [fromZodError(zodError[, options])](#fromzoderror)
- [toValidationError([options]) => (error) => ValidationError](#tovalidationerror)

### ValidationError

Main `ValidationError` class, extending native JavaScript `Error`.

#### Arguments

- `message` - _string_; error message (required)
- `options` - _ErrorOptions_; error options as per [JavaScript definition](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error#options) (optional)
  - `options.cause` - _any_; can be used to hold the original zod error (optional)

#### Example 1: construct new ValidationError with `message`

```typescript
import { ValidationError } from 'zod-validation-error/v4';

const error = new ValidationError('foobar');
console.log(error instanceof Error); // prints true
```

#### Example 2: construct new ValidationError with `message` and `options.cause`

```typescript
import { z as zod } from 'zod/v4';
import { ValidationError } from 'zod-validation-error/v4';

const error = new ValidationError('foobar', {
  cause: new zod.ZodError([
    {
      origin: 'number',
      code: 'too_small',
      minimum: 0,
      inclusive: false,
      path: ['id'],
      message: 'Number must be greater than 0 at "id"',
      input: -1,
    },
  ]),
});

console.log(error.details); // prints issues from zod error
```

### createErrorMap

Creates zod-validation-error's `errorMap`, which is used to format issues into user-friendly error messages.

Meant to be passed as an option to [fromError](#fromerror), [fromZodIssue](#fromzodissue), [fromZodError](#fromzoderror), [toValidationError](#tovalidationerror) or [MessageBuilder](#MessageBuilder).

Note: zod-validation-error's `errorMap` is an errorMap like all others and thus can also be used directly with `zod` (see https://zod.dev/error-customization for further details).

#### Arguments

- `options` - _Object_; formatting options (optional)
  | Name | Type | Description |
  | ---- | :----: | ----------- |
  | `includePath` | `boolean` | Indicates whether to include the erroneous property key in the error message (optional, defaults to `true`) |
  | `displayInvalidFormatDetails` | `boolean` | Indicates whether to display invalid format details (e.g. regexp pattern) in the error message (optional, defaults to `false`) |
  | `maxAllowedValuesToDisplay` | `number` | Max number of allowed values to display (optional, defaults to 10) |
  | `allowedValuesSeparator` | `string` | Used to concatenate allowed values in the message (optional, defaults to `", "`) |
  | `allowedValuesLastSeparator` | `string \| undefined` | Used to concatenate last allowed value in the message (optional, defaults to `" or "`). Set to `undefined` to disable last separator. |
  | `wrapAllowedValuesInQuote` |`boolean` | Indicates whether to wrap allowed values in quotes (optional, defaults to `true`). Note that this only applies to string values. |
  | `maxUnrecognizedKeysToDisplay` | `number` | Max number of unrecognized keys to display in the error message (optional, defaults to `5`) |
  | `unrecognizedKeysSeparator` | `string` | Used to concatenate unrecognized keys in the message (optional, defaults to `", "`) |
  | `unrecognizedKeysLastSeparator` | `string \| undefined` | Used to concatenate the last unrecognized key in message (optional, defaults to `" and "`). Set to `undefined` to disable last separator. |
  | `wrapUnrecognizedKeysInQuote` |`boolean` | Indicates whether to wrap unrecognized keys in quotes (optional, defaults to `true`). Note that this only applies to string keys. |
  | `issuesInTitleCase` |`boolean` | Indicates whether to convert issues to title case (optional, defaults to `true`). |
  | `unionSeparator` | `string` | Used to concatenate union-issues in user-friendly message (optional, defaults to `" or "`) |
  | `issueSeparator` | `string` | Used to concatenate issues in user-friendly message (optional, defaults to `";"`) |
  | `dateLocalization` | `boolean \| Intl.LocalesArgument` | Indicates whether to localize date values in the error message (optional, defaults to `true`). If set to `true`, it will use the default locale of the environment. You can also pass an `Intl.LocalesArgument` to specify a custom locale. |
  | `numberLocalization` | `boolean \| Intl.LocalesArgument` | Indicates whether to localize number values in the error message (optional, defaults to `true`). If set to `true`, it will use the default locale of the environment. You can also pass an `Intl.LocalesArgument` to specify a custom locale. |

#### Example

```typescript
import { createErrorMap } from 'zod-validation-error/v4';

const messageBuilder = createErrorMap({
  includePath: false,
  maxAllowedValuesToDisplay: 3,
});
```

### createMessageBuilder

Creates zod-validation-error's default `MessageBuilder`, which is used to produce user-friendly error messages.

Meant to be passed as an option to [fromError](#fromerror), [fromZodIssue](#fromzodissue), [fromZodError](#fromzoderror) or [toValidationError](#tovalidationerror).

#### Arguments

- `options` - _Object_; formatting options (optional)
  | Name | Type | Description |
  | ---- | :----: | ----------- |
  | `maxIssuesInMessage` | `number` | Max issues to include in user-friendly message (optional, defaults to `99`) |
  | `issueSeparator` | `string` | Used to concatenate issues in user-friendly message (optional, defaults to `";"`) |
  | `prefix` | `string \| undefined` | Prefix to use in user-friendly message (optional, defaults to `"Validation error"`). Pass `undefined` to disable prefix completely. |
  | `prefixSeparator` | `string` | Used to concatenate prefix with rest of the user-friendly message (optional, defaults to `": "`). Not used when `prefix` is `undefined`. |
  | `error` | `ErrorMap` | Accepts an `errorMap` to format individual issues into user-friendly error messages (optional, defaults to `undefined`). Note that this is an optional property and if not provided, the default error map will be used. Also, you don't need to pass zod-validation-error's `errorMap` here; you can use your own custom errorMap if you want. |

#### Example

```typescript
import { createErrorMap, createMessageBuilder } from 'zod-validation-error/v4';

const messageBuilder = createMessageBuilder({
  maxIssuesInMessage: 3,
  error: createErrorMap({
    includePath: false,
  }),
});
```

### isValidationError

A [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) utility function, based on `instanceof` comparison.

#### Arguments

- `error` - error instance (required)

#### Example

```typescript
import { z as zod } from 'zod/v4';
import { ValidationError, isValidationError } from 'zod-validation-error/v4';

const err = new ValidationError('foobar');
isValidationError(err); // returns true

const invalidErr = new Error('foobar');
isValidationError(err); // returns false
```

### isValidationErrorLike

A [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) utility function, based on _heuristics_ comparison.

_Why do we need heuristics since we can use a simple `instanceof` comparison?_ Because of multi-version inconsistencies. For instance, it's possible that a dependency is using an older `zod-validation-error` version internally. In such case, the `instanceof` comparison will yield invalid results because module deduplication does not apply at npm/yarn level and the prototype is different.

tl;dr if you are uncertain then it is preferable to use `isValidationErrorLike` instead of `isValidationError`.

#### Arguments

- `error` - error instance (required)

#### Example

```typescript
import {
  ValidationError,
  isValidationErrorLike,
} from 'zod-validation-error/v4';

const err = new ValidationError('foobar');
isValidationErrorLike(err); // returns true

const invalidErr = new Error('foobar');
isValidationErrorLike(err); // returns false
```

### isZodErrorLike

A [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) utility function, based on _heuristics_ comparison.

_Why do we need heuristics since we can use a simple `instanceof` comparison?_ Because of multi-version inconsistencies. For instance, it's possible that a dependency is using an older `zod` version internally. In such case, the `instanceof` comparison will yield invalid results because module deduplication does not apply at npm/yarn level and the prototype is different.

#### Arguments

- `error` - error instance (required)

#### Example

```typescript
import { z as zod } from 'zod/v4';
import { ValidationError, isZodErrorLike } from 'zod-validation-error/v4';

const zodValidationErr = new ValidationError('foobar');
isZodErrorLike(zodValidationErr); // returns false

const genericErr = new Error('foobar');
isZodErrorLike(genericErr); // returns false

const zodErr = new zod.ZodError([
  {
    origin: 'number',
    code: 'too_small',
    minimum: 0,
    inclusive: false,
    path: ['id'],
    message: 'Number must be greater than 0 at "id"',
    input: -1,
  },
]);
isZodErrorLike(zodErr); // returns true
```

### fromError

Converts an error to `ValidationError`.

_What is the difference between `fromError` and `fromZodError`?_ The `fromError` function is a less strict version of `fromZodError`. It can accept an unknown error and attempt to convert it to a `ValidationError`.

#### Arguments

- `error` - _unknown_; an error (required)
- `options` - _Object_; formatting options (optional)
  - `messageBuilder` - _MessageBuilder_; a function that accepts an array of `zod.ZodIssue` objects and returns a user-friendly error message in the form of a `string` (optional).

#### Notes

Alternatively, you may pass [createMessageBuilder options](#createMessageBuilder) directly as `options`. These will be used as arguments to create the `MessageBuilder` instance internally.

### fromZodIssue

Converts a single zod issue to `ValidationError`.

#### Arguments

- `zodIssue` - _zod.ZodIssue_; a ZodIssue instance (required)
- `options` - _Object_; formatting options (optional)
  - `messageBuilder` - _MessageBuilder_; a function that accepts an array of `zod.ZodIssue` objects and returns a user-friendly error message in the form of a `string` (optional).

#### Notes

Alternatively, you may pass [createMessageBuilder options](#createMessageBuilder) directly as `options`. These will be used as arguments to create the `MessageBuilder` instance internally.

### fromZodError

Converts zod error to `ValidationError`.

_Why is the difference between `ZodError` and `ZodIssue`?_ A `ZodError` is a collection of 1 or more `ZodIssue` instances. It's what you get when you call `zodSchema.parse()`.

#### Arguments

- `zodError` - _zod.ZodError_; a ZodError instance (required)
- `options` - _Object_; formatting options (optional)
  - `messageBuilder` - _MessageBuilder_; a function that accepts an array of `zod.ZodIssue` objects and returns a user-friendly error message in the form of a `string` (optional).

#### Notes

Alternatively, you may pass [createMessageBuilder options](#createMessageBuilder) directly as `options`. These will be used as arguments to create the `MessageBuilder` instance internally.

### toValidationError

A curried version of `fromZodError` meant to be used for FP (Functional Programming). Note it first takes the options object if needed and returns a function that converts the `zodError` to a `ValidationError` object

```js
toValidationError(options) => (zodError) => ValidationError
```

#### Example using fp-ts

```typescript
import * as Either from 'fp-ts/Either';
import { z as zod } from 'zod/v4';
import { toValidationError, ValidationError } from 'zod-validation-error/v4';

// create zod schema
const zodSchema = zod
  .object({
    id: zod.int().positive(),
    email: zod.email(),
  })
  .brand<'User'>();

export type User = zod.infer<typeof zodSchema>;

export function parse(
  value: zod.input<typeof zodSchema>
): Either.Either<ValidationError, User> {
  return Either.tryCatch(() => schema.parse(value), toValidationError());
}
```

## FAQ

### What is the difference between zod-validation-error and zod's own [prettifyError](https://zod.dev/error-formatting#zprettifyerror)?

While both libraries aim to provide a human-readable string representation of a zod error, they differ in several ways...

1. **End-user focus**: zod-validation-error provides opinionated, user-friendly error messages designed to be displayed directly to end-users in forms or API responses, whereas Zod's native error handling seem more developer-focused.
1. **Customization options**: zod-validation-error offers extensive configuration for message formatting, such as controlling path inclusion, allowed values display, localization, and more.
1. **Error handling**: zod-validation-error maintains the original error details while providing a clean, consistent interface through the ValidationError class.
1. **Integration flexibility**: Beyond just formatting, zod-validation-error provides utility functions for error detection and conversion that work well in various architectural patterns, e.g. functional programming.

Disclaimer: as per this [comment](https://github.com/causaly/zod-validation-error/issues/455#issuecomment-2811895152), we have no intention to antagonize zod. In fact, we are happy to decommission this module assuming it's in the best interest of the community. As of now, it seems that there's room for both `zod-validation-error` and `prettifyError`, also based on Colin McDonnell's [response](https://github.com/causaly/zod-validation-error/issues/455#issuecomment-2814466019).

### How to distinguish between errors

Use the `isValidationErrorLike` type guard.

#### Example

Scenario: Distinguish between `ValidationError` VS generic `Error` in order to respond with 400 VS 500 HTTP status code respectively.

```typescript
import { isValidationErrorLike } from 'zod-validation-error/v4';

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

#### Example 1: passing custom message

```typescript
import { ValidationError } from 'zod-validation-error/v4';
import { Buffer } from 'node:buffer';

function parseBuffer(buf: unknown): Buffer {
  if (!Buffer.isBuffer(buf)) {
    throw new ValidationError('Invalid argument; expected buffer');
  }

  return buf;
}
```

#### Example 2: passing custom message and original error as cause

```typescript
import { ValidationError } from 'zod-validation-error/v4';

try {
  // do something that throws an error
} catch (err) {
  throw new ValidationError('Something went deeply wrong', { cause: err });
}
```

### How to use `ValidationError` with custom "error map"

Zod supports customizing error messages by providing a custom "error map". You may combine this with `zod-validation-error` to produce user-friendly messages.

#### Example 1: produce user-friendly error messages using the `errorMap` property

If all you need is to produce user-friendly error messages you may use the `errorMap` property.

```typescript
import { z as zod } from 'zod/v4';
import { fromError, createErrorMap } from 'zod-validation-error/v4';

zod.config({
  customError: createErrorMap({
    includePath: true,
  }),
});
```

### Does `zod-validation-error` support CommonJS

Yes, `zod-validation-error` supports CommonJS out-of-the-box. All you need to do is import it using `require`.

#### Example

```typescript
const { ValidationError } = require('zod-validation-error/v4');
```

## Contribute

Source code contributions are most welcome. Please open a PR, ensure the linter is satisfied and all tests pass.

#### We are hiring

Causaly is building the world's largest biomedical knowledge platform, using technologies such as TypeScript, React and Node.js. Find out more about our openings at https://jobs.ashbyhq.com/causaly.

## License

MIT
