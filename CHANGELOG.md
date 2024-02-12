# @causaly/zod-validation-error

## 3.0.1

### Patch Changes

- 3382fbc: 1. Fix issue with ErrorOptions not being found in earlier to es2022 typescript configs. 2. Add exports definition to package.json to help bundlers (e.g. rollup) identify the right module to use.

## 3.0.0

### Major Changes

- deb4639: BREAKING CHANGE: Refactor `ValidationError` to accept `ErrorOptions` as second parameter.

  What changed?

  Previously, `ValidationError` accepted `Array<ZodIssue>` as 2nd parameter. Now, it accepts `ErrorOptions` which contains a `cause` property. If `cause` is a `ZodError` then it will extract the attached issues and expose them over `error.details`.

  Why?

  This change allows us to use `ValidationError` like a native JavaScript [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error). For example, we can now do:

  ```typescript
  import { ValidationError } from 'zod-validation-error';

  try {
    // attempt to do something that might throw an error
  } catch (err) {
    throw new ValidationError('Something went deeply wrong', { cause: err });
  }
  ```

  How can you update your code?

  If you are using `ValidationError` directly, then you need to update your code to pass `ErrorOptions` as a 2nd parameter.

  ```typescript
  import { ValidationError } from 'zod-validation-error';

  // before
  const err = new ValidationError('Something went wrong', zodError.issues);

  // after
  const err = new ValidationError('Something went wrong', { cause: zodError });
  ```

  If you were never using `ValidationError` directly, then you don't need to do anything.

## 2.1.0

### Minor Changes

- b084ad5: Add `includePath` option to allow users take control on whether to include the erroneous property name in their error messages.

## 2.0.0

### Major Changes

- b199ca1: Update `toValidationError()` to return only `ValidationError` instances

  This change only affects users of `toValidationError()`. The method was previously returning `Error | ValidationError` and now returns only `ValidationError`.

## 1.5.0

### Minor Changes

- 82b7739: Expose errorMap property to use with zod.setErrorMap() method

## 1.4.0

### Minor Changes

- 8893d16: Expose fromZodIssue method

## 1.3.1

### Patch Changes

- 218da5f: fix: casing typo of how zod namespace was referenced

## 1.3.0

### Minor Changes

- 8ccae09: Added exports of types for parameters of fromZodError function

## 1.2.1

### Patch Changes

- 449477d: Switch to using npm instead of yarn. Update node requirement to v.16+

## 1.2.0

### Minor Changes

- f3aa0b2: Better handling for single-item paths

  Given a validation error at array position 1 the error output would read `Error X at "[1]"`. After this change, the error output reads `Error X at index 1`.

  Likewise, previously a validation error at property "_" would yield `Error X at "["_"]"`. Now it yields`Error X at "\*"` which reads much better.

## 1.1.0

### Minor Changes

- b693f52: Handle unicode and special-character identifiers

## 1.0.1

### Patch Changes

- b868741: Fix broken links in API docs

## 1.0.0

### Major Changes

- 90b2f83: Update ZodValidationError to behave more like a native Error constructor. Make options argument optional. Add name property and define toString() method.

## 0.3.2

### Patch Changes

- a2e5322: Ensure union errors do not output duplicate messages

## 0.3.1

### Patch Changes

- 9c4c4ec: Make union errors more detailed

## 0.3.0

### Minor Changes

- 59ad8df: Expose isValidationErrorLike type-guard

## 0.2.2

### Patch Changes

- fa81c9b: Drop SWC; Fix ESM export

## 0.2.1

### Patch Changes

- 7f420d1: Update build and npm badges on README.md

## 0.2.0

### Minor Changes

- fde2f50: update dependency in package json so the user does not have to manually install it, will be installed on package install.

## 0.1.1

### Patch Changes

- 67336ac: Enable automatic release to npm

## 0.1.0

### Minor Changes

- fcda684: Initial functionality
