import type { Primitive } from 'zod';

export function stringifySymbol(symbol: symbol): string {
  return symbol.description ?? '';
}

export function stringifyPrimitive(value: Primitive): string {
  switch (typeof value) {
    case 'symbol':
      return stringifySymbol(value);
    case 'bigint':
    case 'number':
      return value.toLocaleString();
    default:
      return String(value);
  }
}
