import { stringifyValue } from './stringify.ts';
import type { util } from 'zod/v4/core';

export type JoinValuesOptions = {
  separator: string;
  lastSeparator?: string;
  wrapStringsInQuote?: boolean;
  maxValuesToDisplay?: number;
};

export function joinValues(
  values: Array<util.Primitive>,
  options: JoinValuesOptions
): string {
  const valuesToDisplay = (
    options.maxValuesToDisplay
      ? values.slice(0, options.maxValuesToDisplay)
      : values
  ).map((value) => {
    return stringifyValue(value, {
      wrapStringsInQuote: options.wrapStringsInQuote,
    });
  });

  // add remaining values count (if any)
  // this is to avoid displaying too many values in the error message
  // and to keep the message concise
  // e.g. `"foo", "bar", "baz" or 3 more value(s)`
  if (valuesToDisplay.length < values.length) {
    valuesToDisplay.push(
      `${values.length - valuesToDisplay.length} more value(s)`
    );
  }

  return valuesToDisplay.reduce<string>((acc, value, index) => {
    if (index > 0) {
      if (index === valuesToDisplay.length - 1 && options.lastSeparator) {
        acc += options.lastSeparator;
      } else {
        acc += options.separator;
      }
    }

    acc += value;

    return acc;
  }, '');
}
