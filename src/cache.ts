const CACHE = new WeakMap<object, Entries>();

export interface Entries {
  [pointer: string]: unknown;
}

export function clear(operand: object): void {
  CACHE.delete(operand);
}

export function lookup(operand: object): Entries {
  let entries = CACHE.get(operand);

  if (entries == null) {
    entries = Object.create(null) as Entries;
    CACHE.set(operand, entries);
  }

  return entries;
}
