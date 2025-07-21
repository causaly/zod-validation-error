import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree } from './types.ts';

export function parseInvalidUnionIssue(
  issue: zod.$ZodIssueInvalidUnion
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    message: issue.message,
  };
}
