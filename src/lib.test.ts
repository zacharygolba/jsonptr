import { Operand, assign, deref } from "./lib";

let operand: Operand;

beforeEach(() => {
  operand = { a: { b: ["test"] } };
});

test("assign()", () => {
  expect(assign(operand, "/a/c", "Hello, world!")).toBe(true);
  expect(deref(operand, "/a/c")).toBe("Hello, world!");
  expect(operand.a.c).toBe("Hello, world!");

  expect(assign(operand, "/b/c", "Hello, world!")).toBe(false);
  expect(deref(operand, "/b/c")).toBeUndefined();
  expect(operand.b).toBeUndefined();
});

test("deref()", () => {
  expect(deref(operand, "/a/b/0")).toBe(operand.a.b[0]);
  expect(deref(operand, "/a/b")).toBe(deref(operand, "/a/b"));
  expect(deref(operand, "/b/0")).toBeUndefined();
  expect(deref(operand, "/b")).toBeUndefined();
});
