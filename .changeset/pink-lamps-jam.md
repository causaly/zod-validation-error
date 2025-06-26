---
'zod-validation-error': minor
---

Format messages by default, without needing to specify a custom error map. The previous functionlity was default opt-out for message formatting. Now if you want to opt-out you need to pass `error: false` to fromError.
