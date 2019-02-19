import { clear, lookup } from "./cache";

let operand: object;

beforeEach(() => {
  operand = {};
});

test("clear()", () => {
  const entries = lookup(operand);

  expect(clear(operand)).toBeUndefined();
  expect(lookup(operand)).not.toBe(entries);
});

test("lookup()", () => {
  expect(lookup(operand)).toEqual(Object.create(null));
  expect(lookup(operand)).toBe(lookup(operand));
});
