import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree } from './types.ts';

export function parseCustomIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueCustom>
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    message: issue.message ?? '',
  };
}
