import { compile, escape, parse, unescape } from "./token";

test("compile()", () => {
  expect(compile([])).toBe("/");
  expect(compile(["apple", "banana"])).toBe("/apple/banana");
  expect(compile(["apple/banana", "orange"])).toBe("/apple~1banana/orange");
});

test("escape()", () => {
  expect(escape("~0")).toBe("~00");
  expect(escape("~1")).toBe("~01");

  expect(escape("/0")).toBe("~10");
  expect(escape("/1")).toBe("~11");

  expect(escape("/~")).toBe("~1~0");
  expect(escape("//")).toBe("~1~1");
});

test("parse()", () => {
  expect([...parse("/")]).toEqual([]);
  expect([...parse("/apple/")]).toEqual(["apple"]);
  expect([...parse("/apple/banana")]).toEqual(["apple", "banana"]);
  expect([...parse("/apple~1banana/orange")]).toEqual(["apple/banana", "orange"]);

  expect(() => [...parse("")]).toThrowError();
  expect(() => [...parse("apple")]).toThrowError();
});

test("unescape()", () => {
  expect(unescape("~00")).toBe("~0");
  expect(unescape("~01")).toBe("~1");

  expect(unescape("~10")).toBe("/0");
  expect(unescape("~11")).toBe("/1");

  expect(unescape("~1~0")).toBe("/~");
  expect(unescape("~1~1")).toBe("//");
});
