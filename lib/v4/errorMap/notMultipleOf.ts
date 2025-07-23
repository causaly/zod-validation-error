import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree } from './types.ts';

export function parseNotMultipleOfIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueNotMultipleOf>
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    message: `expected multiple of ${issue.divisor}`,
  };
}
