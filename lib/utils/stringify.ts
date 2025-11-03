import type { util } from 'zod';

export function stringifySymbol(symbol: symbol): string {
  return symbol.description ?? '';
}

export type StringifyValueOptions = {
  wrapStringValueInQuote?: boolean;
  localization?: boolean | Intl.LocalesArgument;
};

export function stringify(
  value: util.Primitive | Date,
  options: StringifyValueOptions = {}
): string {
  switch (typeof value) {
    case 'symbol':
      return stringifySymbol(value);
    case 'bigint':
    case 'number': {
      switch (options.localization) {
        case true:
          return value.toLocaleString();
        case false:
          return value.toString();
        default:
          return value.toLocaleString(options.localization);
      }
    }
    case 'string': {
      if (options.wrapStringValueInQuote) {
        return `"${value}"`;
      }
      return value;
    }
    default: {
      if (value instanceof Date) {
        switch (options.localization) {
          case true:
            return value.toLocaleString();
          case false:
            return value.toISOString();
          default:
            return value.toLocaleString(options.localization);
        }
      }
      return String(value);
    }
  }
}
