import { parseInvalidElement } from './invalidElement.ts';
import { parseInvalidStringFormatIssue } from './invalidStringFormat.ts';
import { parseInvalidTypeIssue } from './invalidType.ts';
import { parseInvalidValue } from './invalidValue.ts';
import { parseTooBigIssue } from './tooBig.ts';
import { parseTooSmallIssue } from './tooSmall.ts';
import type {
  IssueType,
  AbstractSyntaxTree,
  IssueParseOptions,
} from './types.ts';

export const issueParsers: Record<
  IssueType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (issue: any, options: IssueParseOptions) => AbstractSyntaxTree
> = {
  invalid_type: parseInvalidTypeIssue,
  too_big: parseTooBigIssue,
  too_small: parseTooSmallIssue,
  invalid_format: parseInvalidStringFormatIssue,
  invalid_value: parseInvalidValue,
  invalid_element: parseInvalidElement,
};
