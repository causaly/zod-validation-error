---
'zod-validation-error': minor
---

Match `ZodError` via heuristics instead of relying on `instanceof`.

_Why?_ Because we want to ensure that zod-validation-error works smoothly even when multiple versions of zod have been installed in the same project.
