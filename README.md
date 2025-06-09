# @alg/enum

[![JSR](https://jsr.io/badges/@alg/enum)](https://jsr.io/@alg/enum)
[![License](https://img.shields.io/badge/Apache--2.0-green?label=license)](https://codeberg.org/algjs/enum/src/branch/main/LICENSE)

Eager functions for Iterables.

See [@alg/stream](https://jsr.io/@alg/stream) for lazily evaluated functions.

## Install

```
deno add jsr:@alg/enum
```

## Example

```javascript
import * as Enum from "@alg/enum";

let data = ["foo", "bar", "baz", "foobar"];

data = Enum.takeWhile(data, (e) => e.length <= 3);
data = Enum.map(data, (e) => e.toUpperCase());
data = Enum.take(data, 2);

console.log(data);  // ["FOO", "BAR"]
```
