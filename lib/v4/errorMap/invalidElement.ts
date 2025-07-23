import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree } from './types.ts';

export function parseInvalidElementIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueInvalidElement>
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    message: `unexpected element in ${issue.origin}`,
  };
}
