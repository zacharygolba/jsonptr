const UNESCAPED = /([~/])/g;
const ESCAPED = /(~[01])/g;

/**
 * Compiles and returns a JSON pointer from an iterable of unescaped tokens.
 *
 * ```typescript
 * import jsonptr from "@zakgolba/jsonptr";
 *
 * console.log(jsonptr.compile(["hello", "world"]));
 * // => /hello/world
 *
 * console.log(jsonptr.compile(["hello/world", "pointer"]));
 * // => /hello~1world/pointer
 * ```
 */
export function compile(tokens: Iterable<string>): string {
  return `/${Array.from(tokens, escape).join("/")}`;
}

export function escape(token: string): string {
  switch (token) {
    case "~":
      return "~0";
    case "/":
      return "~1";
    default:
      return token.replace(UNESCAPED, escape);
  }
}

/**
 * Lazily parses and unescapes each token in the provided `pointer`.
 *
 * ```typescript
 * import jsonptr from "@zakgolba/jsonptr";
 *
 * console.log([...jsonptr.parse("/hello/world")]);
 * // => ["hello", "world"]
 *
 * for (const token of jsonptr.parse("/hello~1world/pointer")) {
 *   console.log(token);
 * }
 * // => hello/world
 * // => pointer
 * ```
 */
export function* parse(pointer: string): IterableIterator<string> {
  const chars = pointer[Symbol.iterator]();
  let result = chars.next();
  let token = "";

  if (result.done || result.value !== "/") {
    throw new Error(`"${pointer}" is not a valid JSON pointer`);
  }

  while (!result.done) {
    result = chars.next();
    if (result.value === "/" || (result.done && token !== "")) {
      yield unescape(token);
      token = "";
    } else {
      token += result.value;
    }
  }
}

export function unescape(token: string): string {
  switch (token) {
    case "~0":
      return "~";
    case "~1":
      return "/";
    default:
      return token.replace(ESCAPED, unescape);
  }
}
