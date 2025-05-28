import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree } from './types.ts';

export function parseNotMultipleOf(
  issue: zod.$ZodIssueNotMultipleOf
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: `invalid value`,
    expectation: `expected multiple of ${issue.divisor}`,
  };
}
