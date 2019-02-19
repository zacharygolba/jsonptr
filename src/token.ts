const UNESCAPED = /([~/])/g;
const ESCAPED = /(~[01])/g;

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
