import type { util } from 'zod/v4/core';

export function isPrimitive(value: unknown): value is util.Primitive {
  if (value === null) {
    return true;
  }

  switch (typeof value) {
    case 'string':
    case 'number':
    case 'bigint':
    case 'boolean':
    case 'symbol':
    case 'undefined':
      return true;
    default:
      return false;
  }
}
