import type * as zod from 'zod/v4/core';

export type IssueType = NonNullable<zod.$ZodIssue['code']>;

export type AbstractSyntaxTree = {
  type: IssueType;
  claim: string;
  path?: zod.$ZodIssue['path'];
  expectation?: string;
  realization?: string;
};

export type ErrorMapOptions = {
  displayInvalidFormatDetails: boolean;
  // Allowed Values
  valuesSeparator: string;
  valuesLastSeparator: string | undefined;
  wrapStringValuesInQuote: boolean;
  maxValuesToDisplay: number;
  // Unrecognized keys
  unrecognizedKeysSeparator: string;
  unrecognizedKeysLastSeparator: string | undefined;
  wrapUnrecognizedKeysInQuote: boolean;
  maxUnrecognizedKeysToDisplay: number;
  includePath: boolean;
  issueSeparator: string;
  unionSeparator: string;
  errorDetails?: {
    disabled?: boolean;
    prefix?: string;
    suffix?: string;
  };
};
