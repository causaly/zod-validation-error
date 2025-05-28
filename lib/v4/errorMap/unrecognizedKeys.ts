import { joinValues } from '../../utils/joinValues.ts';
import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree } from './types.ts';

export function parseUnrecognizedKeysIssue(
  issue: zod.$ZodIssueUnrecognizedKeys
): AbstractSyntaxTree {
  const keysStr = joinValues(issue.keys, {
    separator: ', ',
    lastSeparator: ' and ',
    wrapStringsInQuote: true,
  });

  return {
    type: issue.code,
    path: issue.path,
    claim: `invalid object`,
    realization: `unrecognized key${
      issue.keys.length === 1 ? '' : 's'
    } ${keysStr}`,
  };
}
