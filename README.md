# zod-validation-error

Wrap zod validation errors in user-friendly readable messages.

[![Build Status](https://github.com/causaly/zod-validation-error/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/causaly/zod-validation-error/actions/workflows/ci.yml) [![npm version](https://badge.fury.io/js/zod-validation-error.svg)](https://www.npmjs.com/package/zod-validation-error)

#### Features

- User-friendly readable messages, configurable via options;
- Maintain original errors under `error.details`;
- Extensive tests.

## Installation

```bash
npm install zod-validation-error
```

#### Requirements

- Node.js v.14+

## Quick start

```typescript
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

## Contribute

Source code contributions are most welcome. Please open a PR, ensure the linter is satisfied and all tests pass.

#### We are hiring

Causaly is building the world's largest biomedical knowledge platform, using technologies such as TypeScript, React and Node.js. Find out more about our openings at https://apply.workable.com/causaly/.

## License

MIT
