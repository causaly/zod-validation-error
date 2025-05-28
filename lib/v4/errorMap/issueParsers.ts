import { parseInvalidElementIssue } from './invalidElement.ts';
import { parseInvalidStringFormatIssue } from './invalidStringFormat.ts';
import { parseInvalidTypeIssue } from './invalidType.ts';
import { parseInvalidValueIssue } from './invalidValue.ts';
import { parseNotMultipleOfIssue } from './notMultipleOf.ts';
import { parseTooBigIssue } from './tooBig.ts';
import { parseTooSmallIssue } from './tooSmall.ts';
import { parseUnrecognizedKeysIssue } from './unrecognizedKeys.ts';
import type {
  IssueType,
  ErrorMapOptions,
  AbstractSyntaxTree,
} from './types.ts';

export const issueParsers: Record<
  IssueType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (issue: any, options: ErrorMapOptions) => AbstractSyntaxTree
> = {
  invalid_type: parseInvalidTypeIssue,
  too_big: parseTooBigIssue,
  too_small: parseTooSmallIssue,
  invalid_format: parseInvalidStringFormatIssue,
  invalid_value: parseInvalidValueIssue,
  invalid_element: parseInvalidElementIssue,
  not_multiple_of: parseNotMultipleOfIssue,
  unrecognized_keys: parseUnrecognizedKeysIssue,
  // TODO: implement these parsers:
  // invalid_key: undefined,
  // custom: undefined,
  // invalid_union: undefined,
};
