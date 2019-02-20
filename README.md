# jsonptr

[![CircleCI](https://img.shields.io/circleci/project/github/zacharygolba/jsonptr/master.svg?style=flat-square)](https://circleci.com/gh/zacharygolba/jsonptr/tree/master) [![Codecov](https://img.shields.io/codecov/c/github/zacharygolba/jsonptr/master.svg?style=flat-square)](https://codecov.io/gh/zacharygolba/jsonptr/branch/master) [![npm](https://img.shields.io/npm/v/@zakgolba/jsonptr.svg?style=flat-square)](https://www.npmjs.com/package/@zakgolba/jsonptr)

Read and write values to locations referenced by JSON pointers as described in [RFC 6901](https://tools.ietf.org/html/rfc6901).

## Usage

### Installation

```sh
# If you're using npm
npm install @zakgolba/jsonptr --save

# If you're using yarn
yarn add @zakgolba/jsonptr
```

### API Documentation

#### assign(operand: object, pointer: string, value: any): boolean

Attempts to write a value to the location that the `pointer` references.

If the value is stored successfully, the cached pointers for the `target` provided will be invalidated.

Returns a `boolean` that represents whether or not the value was able to be written to the location that the `pointer` references.

```typescript
import jsonptr from "@zakgolba/jsonptr";

const data = { hello: {} };

jsonptr.assign(data, "/hello/world", "Hello, world!");
console.log(data.hello.world);
// => Hello, world!

console.log(jsonptr.assign(data, "/invalid/reference", "Hello, world!"));
// => false
```

#### compile(tokens: Iterable\<string>): string

Compiles and returns a JSON pointer from an iterable of unescaped tokens.

```typescript
import jsonptr from "@zakgolba/jsonptr";

console.log(jsonptr.compile(["hello", "world"]));
// => /hello/world

console.log(jsonptr.compile(["hello/world", "pointer"]));
// => /hello~1world/pointer
```

#### deref(operand: object, pointer: string): unknown

Attempts to read and return the value at the location that the `pointer` references.

```typescript
import jsonptr from "@zakgolba/jsonptr";

const data = { hello: { world: "Hello, world!" } };

console.log(jsonptr.deref(data, "/hello/world"));
// => Hello, world!
console.log(jsonptr.deref(data, "/this/points/nowhere"));
// => undefined
```

#### parse(pointer: string): IterableIterator\<string>

Lazily parses and unescapes each token in the provided `pointer`.

```typescript
import jsonptr from "@zakgolba/jsonptr";

console.log([...jsonptr.parse("/hello/world")]);
// => ["hello", "world"]

for (const token of jsonptr.parse("/hello~1world/pointer")) {
  console.log(token);
}
// => hello/world
// => pointer
```

## License

Licensed under either of

- Apache License, Version 2.0
  ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license
  ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
