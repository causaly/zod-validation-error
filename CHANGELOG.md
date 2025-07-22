# @causaly/zod-validation-error

## 4.0.0

### Major Changes

- 9be31d2: Make v4 the default export of zod-validation-error
- b979890: Add support for zod v4 as a peer dependency.
- 3bf9e78: Update the API to separate between error mapping and message building.

## 3.5.2

### Patch Changes

- 3809f85: Include paths of sub-issues of union.

## 3.5.1

### Patch Changes

- e7713d5: Add compatibility with older node versions and module-resolution strategies + improve docs

## 3.5.0

### Minor Changes

- bf72012: Add support for zod v4

## 3.4.1

### Patch Changes

- 94d5f3b: Bump zod to v.3.24.4 in package.json as dev + peer dependency

## 3.4.0

### Minor Changes

- 3a7928c: Customize error messages using a MessageBuilder.

## 3.3.1

### Patch Changes

- 42bc4fe: Test Version Packages fix

## 3.3.0

### Minor Changes

- 66f5b5d: Match `ZodError` via heuristics instead of relying on `instanceof`.

  _Why?_ Because we want to ensure that zod-validation-error works smoothly even when multiple versions of zod have been installed in the same project.

## 3.2.0

### Minor Changes

- 6b4e8a0: Introduce `fromError` API which is a less strict version of `fromZodError`
- 35a28c6: Add runtime check in `fromZodError` and throw dev-friendly `TypeError` suggesting usage of `fromError` instead

## 3.1.0

### Minor Changes

- 3f5e391: Better error messages for zod.function() types

## 3.0.3

### Patch Changes

- 2f1ef27: Bundle code as a single index.js (cjs) or index.mjs (esm) file. Restore exports configuration in package.json.

## 3.0.2

### Patch Changes

- 24b773c: Revert package.json exports causing dependant projects to fail

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
