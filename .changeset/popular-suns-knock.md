---
'zod-validation-error': major
---

BREAKING CHANGE: Refactor `ValidationError` to accept `ErrorOptions` as second parameter.

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
