import type { AbstractSyntaxTree, IssueParseOptions } from './types.ts';
import type * as zod from 'zod/v4/core';

export function parseInvalidStringFormatIssue(
  issue: zod.$ZodIssueInvalidStringFormat,
  options: Pick<IssueParseOptions, 'displayInvalidFormatDetails'> = {
    displayInvalidFormatDetails: false,
  }
): AbstractSyntaxTree {
  let expectation: string;

  switch (issue.format) {
    case 'lowercase':
    case 'uppercase': {
      expectation = `expected all characters to be in ${issue.format} format`;
      break;
    }
    default: {
      if (isZodIssueStringStartsWith(issue)) {
        return parseStringStartsWith(issue);
      }
      if (isZodIssueStringEndsWith(issue)) {
        return parseStringEndsWith(issue);
      }
      if (isZodIssueStringIncludes(issue)) {
        return parseStringIncludes(issue);
      }
      if (isZodIssueStringInvalidRegex(issue)) {
        return parseStringInvalidRegex(issue, options);
      }
      if (isZodIssueStringInvalidJWT(issue)) {
        return parseStringInvalidJWT(issue, options);
      }

      expectation = `expected ${issue.format} format`;
    }
  }

  return {
    type: issue.code,
    path: issue.path,
    claim: 'malformed value',
    expectation,
  };
}
function isZodIssueStringStartsWith(
  issue: zod.$ZodIssueInvalidStringFormat
): issue is zod.$ZodIssueStringStartsWith {
  return issue.format === 'starts_with';
}
function parseStringStartsWith(
  issue: zod.$ZodIssueStringStartsWith
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: 'malformed value',
    expectation: `should start with "${issue.prefix}"`,
  };
}
function isZodIssueStringEndsWith(
  issue: zod.$ZodIssueInvalidStringFormat
): issue is zod.$ZodIssueStringEndsWith {
  return issue.format === 'ends_with';
}
function parseStringEndsWith(
  issue: zod.$ZodIssueStringEndsWith
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: 'malformed value',
    expectation: `should end with "${issue.suffix}"`,
  };
}
function isZodIssueStringIncludes(
  issue: zod.$ZodIssueInvalidStringFormat
): issue is zod.$ZodIssueStringIncludes {
  return issue.format === 'includes';
}
function parseStringIncludes(
  issue: zod.$ZodIssueStringIncludes
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: 'malformed value',
    expectation: `should include "${issue.includes}"`,
  };
}
function isZodIssueStringInvalidRegex(
  issue: zod.$ZodIssueInvalidStringFormat
): issue is zod.$ZodIssueStringInvalidRegex {
  return issue.format === 'regex';
}
function parseStringInvalidRegex(
  issue: zod.$ZodIssueStringInvalidRegex,
  options: Pick<IssueParseOptions, 'displayInvalidFormatDetails'> = {
    displayInvalidFormatDetails: false,
  }
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: 'malformed value',
    expectation: options.displayInvalidFormatDetails
      ? `should match pattern "${issue.pattern}"`
      : `does not match expected pattern`,
  };
}
function isZodIssueStringInvalidJWT(
  issue: zod.$ZodIssueInvalidStringFormat
): issue is zod.$ZodIssueStringInvalidJWT {
  return issue.format === 'jwt';
}
function parseStringInvalidJWT(
  issue: zod.$ZodIssueStringInvalidJWT,
  options: Pick<IssueParseOptions, 'displayInvalidFormatDetails'> = {
    displayInvalidFormatDetails: false,
  }
): AbstractSyntaxTree {
  return {
    type: issue.code,
    path: issue.path,
    claim: 'malformed value',
    expectation:
      options.displayInvalidFormatDetails && issue.algorithm
        ? `expected jwt (${issue.algorithm}) format`
        : `expected jwt format`,
  };
}
