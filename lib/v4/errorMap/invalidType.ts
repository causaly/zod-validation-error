import { isPrimitive } from '../../utils/isPrimitive.ts';
import { stringify } from '../../utils/stringify.ts';
import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';
import type * as zod from 'zod/v4/core';

export function parseInvalidTypeIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueInvalidType>,
  options: Pick<
    ErrorMapOptions,
    'reportInput' | 'numberLocalization' | 'dateLocalization'
  >
): AbstractSyntaxTree {
  let message = `expected ${issue.expected}`;

  // note: it's possible that issue.input is not defined
  if ('input' in issue && options.reportInput !== false) {
    const value = issue.input;
    message += `, received ${getTypeName(value)}`;

    if (options.reportInput === 'typeAndValue') {
      if (isPrimitive(value)) {
        const valueStr = stringify(value, {
          wrapStringValueInQuote: true,
          localization: options.numberLocalization,
        });
        message += ` (${valueStr})`;
      } else if (value instanceof Date) {
        const valueStr = stringify(value, {
          localization: options.dateLocalization,
        });
        message += ` (${valueStr})`;
      }
    }
  }

  return {
    type: issue.code,
    path: issue.path,
    message,
  };
}

export function getTypeName(value: unknown): string {
  if (typeof value === 'object') {
    if (value === null) {
      return 'null';
    }
    if (value === undefined) {
      return 'undefined';
    }
    if (Array.isArray(value)) {
      return 'array';
    }
    if (value instanceof Date) {
      return 'date';
    }
    if (value instanceof RegExp) {
      return 'regexp';
    }
    if (value instanceof Map) {
      return 'map';
    }
    if (value instanceof Set) {
      return 'set';
    }
    if (value instanceof Error) {
      return 'error';
    }
    if (value instanceof Function) {
      return 'function';
    }
    return 'object';
  }

  return typeof value;
}
