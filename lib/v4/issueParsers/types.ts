import type * as zod from 'zod/v4/core';

export type IssueType = NonNullable<zod.$ZodIssue['code']>;

export type AbstractSyntaxTree = {
  type: IssueType;
  claim: string;
  path?: zod.$ZodIssue['path'];
  expectation?: string;
  realization?: string;
};

export type IssueParseOptions = {
  displayInvalidFormatDetails: boolean;
  valuesSeparator: string;
  valuesLastSeparator: string | undefined;
  wrapStringValuesInQuote: boolean;
  maxValuesToDisplay: number;
};
