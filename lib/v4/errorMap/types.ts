import type * as zod from 'zod/v4/core';

export type IssueType = NonNullable<zod.$ZodIssue['code']>;

export type AbstractSyntaxTree = {
  type: IssueType;
  path?: zod.$ZodIssue['path'];
  message: string;
};

export type ErrorMapOptions = {
  // Include path
  includePath: boolean;
  // Stringify options
  dateLocalization: boolean | Intl.LocalesArgument;
  numberLocalization: boolean | Intl.LocalesArgument;
  // Concat issues
  unionSeparator: string;
  issueSeparator: string;
  issuesInTitleCase: boolean;
  // Invalid format options
  displayInvalidFormatDetails: boolean;
  // Allowed values options
  allowedValuesSeparator: string;
  allowedValuesLastSeparator: string | undefined;
  wrapAllowedValuesInQuote: boolean;
  maxAllowedValuesToDisplay: number;
  // Unrecognized keys options
  unrecognizedKeysSeparator: string;
  unrecognizedKeysLastSeparator: string | undefined;
  wrapUnrecognizedKeysInQuote: boolean;
  maxUnrecognizedKeysToDisplay: number;
};
