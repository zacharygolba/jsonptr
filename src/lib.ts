import * as cache from "./cache";
import { compile, parse } from "./token";

export { compile, parse };

/**
 * Represents the operand of `assign` and `deref` operations.
 */
export interface Operand {
  [key: string]: any;
}

/**
 * Attempts to write a value to the location that the `pointer` references.
 *
 * If the value is stored successfully, the cached pointers for the `target`
 * provided will be invalidated.
 *
 * Returns a `boolean` that represents whether or not the value was able to be
 * written to the location that the `pointer` references.
 *
 * ```typescript
 * import jsonptr from "@zakgolba/jsonptr";
 *
 * const data = { hello: {} };
 *
 * jsonptr.assign(data, "/hello/world", "Hello, world!");
 * console.log(data.hello.world);
 * // => Hello, world!
 *
 * console.log(jsonptr.assign(data, "/invalid/reference", "Hello, world!"));
 * // => false
 * ```
 */
export function assign(operand: Operand, pointer: string, value: any): boolean {
  const tokens = [...parse(pointer)];
  const lastToken = tokens.pop();
  const parentValue = deref(operand, compile(tokens));

  if (lastToken == null || parentValue == null) {
    return false;
  }

  (parentValue as any)[lastToken] = value;
  cache.clear(operand);
  return true;
}

/**
 * Attempts to read and return the value at the location that the `pointer`
 * references.
 *
 * ```typescript
 * import jsonptr from "@zakgolba/jsonptr";
 *
 * const data = { hello: { world: "Hello, world!" } };
 *
 * console.log(jsonptr.deref(data, "/hello/world"));
 * // => Hello, world!
 * console.log(jsonptr.deref(data, "/this/points/nowhere"));
 * // => undefined
 * ```
 */
export function deref(operand: Operand, pointer: string): unknown {
  const entries = cache.lookup(operand);
  let value = operand as any;

  if (pointer in entries) {
    return entries[pointer];
  }

  for (const key of parse(pointer)) {
    value = value[key];
    if (value == null) {
      value = undefined;
      break;
    }
  }

  return (entries[pointer] = value);
}
