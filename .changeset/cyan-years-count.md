---
'zod-validation-error': major
---

Better handling for single-item paths

Given a validation error at array position 1 the error output would read `Error X at "[1]"`. After this change, the error output reads `Error X at index 1`.

Likewise, previously a validation error at property "_" would yield `Error X at "["_"]"`. Now it yields `Error X at "\*"` which reads much better.
