import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree } from './types.ts';

export function parseInvalidElement(
  issue: zod.$ZodIssueInvalidElement
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: `invalid element in ${issue.origin}`,
  };
}
