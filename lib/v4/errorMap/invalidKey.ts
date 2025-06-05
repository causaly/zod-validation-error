import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree } from './types.ts';

export function parseInvalidKeyIssue(
  issue: zod.$ZodIssueInvalidKey
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    message: `unexpected key in ${issue.origin}`,
  };
}
