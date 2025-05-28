import { stringifyPrimitive } from './stringify.ts';
import type { Primitive } from 'zod';

export type JoinValuesOptions = {
  separator: string;
  lastSeparator?: string;
  wrapStringsInQuote?: boolean;
  maxValuesToDisplay?: number;
};

export function joinValues(
  values: Array<Primitive>,
  options: JoinValuesOptions
): string {
  let str = '';
  const maxLength = Math.min(
    options.maxValuesToDisplay ?? Number.MAX_SAFE_INTEGER,
    values.length
  );

  for (let index = 0; index < maxLength; index++) {
    const value = values[index];

    if (index > 0) {
      if (options.lastSeparator && index === maxLength - 1) {
        str += options.lastSeparator;
      } else {
        str += options.separator;
      }
    }

    if (typeof value === 'string' && options.wrapStringsInQuote) {
      str += `"${value}"`;
    } else {
      str += stringifyPrimitive(value);
    }
  }

  return str;
}
