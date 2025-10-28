import type * as zod from 'zod/v4/core';

export type IssueType = NonNullable<zod.$ZodIssue['code']>;

export type AbstractSyntaxTree = {
  type: IssueType;
  path?: zod.$ZodIssue['path'];
  message: string;
};

export type ErrorMapOptions = {
  // Stringify values
  dateLocalization: boolean | Intl.LocalesArgument;
  numberLocalization: boolean | Intl.LocalesArgument;
  // Invalid format options
  displayInvalidFormatDetails: boolean;
  // Report input type
  reportInput: false | 'type' | 'typeAndValue';
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
