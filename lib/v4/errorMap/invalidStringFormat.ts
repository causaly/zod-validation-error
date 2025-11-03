import { prependWithAOrAn } from '../../utils/prependWithAOrAn.ts';
import { stringify } from '../../utils/stringify.ts';
import type * as zod from 'zod/v4/core';
import type { AbstractSyntaxTree, ErrorMapOptions } from './types.ts';

export function parseInvalidStringFormatIssue(
  issue: zod.$ZodRawIssue<zod.$ZodIssueInvalidStringFormat>,
  options: Pick<
    ErrorMapOptions,
    'displayInvalidFormatDetails' | 'reportInput' | 'numberLocalization'
  >
): AbstractSyntaxTree {
  let message = '';

  switch (issue.format) {
    case 'lowercase':
    case 'uppercase':
      message += `expected ${issue.format} string`;
      break;
    case 'starts_with': {
      message += `expected string to start with "${issue.prefix}"`;
      break;
    }
    case 'ends_with': {
      message += `expected string to end with "${issue.suffix}"`;
      break;
    }
    case 'includes': {
      message += `expected string to include "${issue.includes}"`;
      break;
    }
    case 'regex': {
      message += 'expected string to match pattern';
      if (options.displayInvalidFormatDetails) {
        message += ` "${issue.pattern}"`;
      }
      break;
    }
    case 'jwt': {
      message += 'expected a jwt';
      if (
        options.displayInvalidFormatDetails &&
        issue.inst &&
        'alg' in issue.inst._zod.def
      ) {
        message += `/${issue.inst._zod.def.alg}`;
      }
      message += ' token';
      break;
    }
    case 'email': {
      message += 'expected an email address';
      break;
    }
    case 'url':
    case 'uuid':
    case 'guid':
    case 'cuid':
    case 'cuid2':
    case 'ulid':
    case 'xid':
    case 'ksuid': {
      message += `expected a ${issue.format.toUpperCase()}`;
      if (issue.inst && 'version' in issue.inst._zod.def) {
        message += ` ${issue.inst._zod.def.version}`;
      }
      break;
    }
    case 'date':
    case 'datetime':
    case 'time':
    case 'duration': {
      message += `expected an ISO ${issue.format}`;
      break;
    }
    case 'ipv4':
    case 'ipv6': {
      message += `expected an ${issue.format
        .slice(0, 2)
        .toUpperCase()}${issue.format.slice(2)} address`;
      break;
    }
    case 'cidrv4':
    case 'cidrv6': {
      message += `expected a ${issue.format
        .slice(0, 4)
        .toUpperCase()}${issue.format.slice(4)} address range`;
      break;
    }
    case 'base64':
    case 'base64url': {
      message += `expected a ${issue.format} encoded string`;
      break;
    }
    case 'e164': {
      message += 'expected an E.164 formatted phone number';
      break;
    }
    default: {
      if (issue.format.startsWith('sha') || issue.format.startsWith('md5')) {
        const [alg, encoding] = issue.format.split('_');
        message += `expected a ${alg.toUpperCase()}`;
        if (encoding) {
          message += ` ${encoding}-encoded`;
        }
        message += ` hash`;
        break;
      }

      message += `expected ${prependWithAOrAn(issue.format)}`;
    }
  }

  if ('input' in issue && options.reportInput === 'typeAndValue') {
    const valueStr = stringify(issue.input, {
      wrapStringValueInQuote: true,
      localization: options.numberLocalization,
    });
    message += `, received ${valueStr}`;
  }

  return {
    type: issue.code,
    path: issue.path,
    message,
  };
}
