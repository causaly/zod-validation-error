---
'zod-validation-error': patch
---

1. Fix issue with ErrorOptions not being found in earlier to es2022 typescript configs.
2. Add exports definition to package.json to help bundlers (e.g. rollup) identify the right module to use.
