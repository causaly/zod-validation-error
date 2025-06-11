import type { util } from 'zod/v4/core';

export function stringifySymbol(symbol: symbol): string {
  return symbol.description ?? '';
}

export type StringifyValueOptions = {
  wrapStringsInQuote?: boolean;
};

export function stringifyValue(
  value: util.Primitive,
  options: StringifyValueOptions = {}
): string {
  switch (typeof value) {
    case 'symbol':
      return stringifySymbol(value);
    case 'bigint':
    case 'number':
      return value.toLocaleString();
    case 'string': {
      if (options.wrapStringsInQuote) {
        return `"${value}"`;
      }
      return value;
    }
    default:
      return String(value);
  }
}
