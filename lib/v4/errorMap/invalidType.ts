import type { AbstractSyntaxTree } from './types.ts';
import type * as zod from 'zod/v4/core';

export function parseInvalidTypeIssue(
  issue: zod.$ZodIssueInvalidType
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: 'invalid type',
    expectation: `expected ${issue.expected}`,
    realization: compileTypeRealization(issue),
  };
} //     format: "jwt";
//     algorithm?: string;
// }

export function compileTypeRealization(
  issue: zod.$ZodIssue
): string | undefined {
  if (!('input' in issue)) {
    return undefined;
  }

  return `received ${typeof issue.input}`;
}
