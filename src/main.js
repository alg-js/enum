/* Copyright 2025 @alg/enum contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* @ts-self-types="./main.d.ts" */

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @returns {Iterator<T>}
 */
function iter(iterable) {
    return iterable[Symbol.iterator]();
}

export function all(iterable, predicate) {
    return iter(iterable).every(predicate);
}

export function any(iterable, predicate) {
    return iter(iterable).some(predicate);
}

export function chain(...iterables) {
    const result = [];
    for (const it of iterables) {
        result.push(...it);
    }
    return result;
}

export function chunk(
    iterable,
    size,
    {strategy = "dropEnd", fillValue = undefined} = {}
) {
    if (size <= 0) {
        throw new Error("Cannot yield chunks of size <= 0");
    }
    const result = [];
    let current = [];
    for (const e of iterable) {
        current.push(e);
        if (current.length === size) {
            result.push(current);
            current = [];
        }
    }
    if (strategy === "keepEnd" && current.length !== 0) {
        result.push(current);
    } else if (strategy === "padEnd" && current.length !== 0) {
        current.length = size;
        result.push(Array.from(current, (e) => e ?? fillValue))
    } else if (strategy === "strict" && current.length !== 0) {
        throw Error("Incomplete chunk");
    }
    return result;
}

export function consume(iterable) {
    for (const _ of iterable) {
        // gobble gobble
    }
}

export function dedup(iterable, {eq = (left, right) => left === right} = {}) {
    const it = iter(iterable);
    const first = it.next();
    if (first.done) {
        return [];
    }
    const result = [first.value];
    for (const e of it) {
        if (!eq(result.at(-1), e)) {
            result.push(e);
        }
    }
    return result;
}

export function drop(iterable, limit) {
    const it = iter(iterable);
    for (let i = 0; i < limit; i++) {
        it.next();
    }
    return [...it];
}

export function dropWhile(iterable, predicate) {
    const it = iter(iterable);
    let i = 0;
    let e = it.next();
    while (!e.done && predicate(e.value, i)) {
        e = it.next();
        i += 1;
    }
    return e.done ? [] : [e.value, ...it];
}

export function filter(iterable, predicate) {
    return [...iter(iterable).filter(predicate)];
}

export function find(iterable, predicate) {
    return iter(iterable).find(predicate);
}

export function findIndex(iterable, predicate) {
    let i = 0;
    for (const e of iterable) {
        if (predicate(e, i)) {
            return i;
        }
        i += 1;
    }
    return -1;
}

export function flatMap(iterable, mapping) {
    let i = 0;
    const result = [];
    for (const e of iterable) {
        result.push(...mapping(e, i));
        i += 1;
    }
    return result;
}

export function forEach(iterable, consumer) {
    let i = 0;
    for (const e of iterable) {
        consumer(e, i);
        i += 1;
    }
}

export function length(iterable) {
    let count = 0;
    for (const _ of iterable) {
        count += 1;
    }
    return count;
}

export function map(iterable, mapping) {
    return [...iter(iterable).map(mapping)];
}

export function reduce(iterable, reducer, initial) {
    if (initial === undefined) {
        return iter(iterable).reduce(reducer);
    } else {
        return iter(iterable).reduce(reducer, initial);
    }
}

export function repeat(object, times) {
    const result = [];
    for (let i = 0; i < times; i++) {
        result.push(object);
    }
    return result;
}

export function reverse(iterable) {
    const result = [...iterable];
    result.reverse();
    return result;
}

export function scan(iterable, accumulator, initial) {
    let i;
    const result = [];
    const it = iter(iterable);
    let current;
    if (initial !== undefined) {
        current = initial;
        i = 0;
    } else {
        const first = it.next();
        if (first.done) {
            return [];
        }
        current = first.value;
        result.push(first.value);
        i = 1;
    }
    for (const e of it) {
        const acc = accumulator(current, e, i);
        result.push(acc);
        current = acc;
        i += 1;
    }
    return result;
}

export function take(iterable, limit) {
    return [...iter(iterable).take(limit)];
}

export function takeWhile(iterable, predicate) {
    let i = 0;
    const result = [];
    for (const e of iterable) {
        if (predicate(e, i)) {
            result.push(e);
        } else {
            break;
        }
        i += 1;
    }
    return result;
}

export function window(iterable, size) {
    if (size === 0) {
        throw new Error("Cannot yield sliding windows of size 0");
    }
    const it = iter(iterable);
    const arr = [];
    for (let i = 0; i < size; i++) {
        const next = it.next();
        if (next.done) {
            break;
        } else {
            arr.push(next.value);
        }
    }
    if (arr.length < size) {
        return [];
    }

    const result = [[...arr]];
    let front = 0;
    for (const e of it) {
        arr[front] = e;
        front = (front + 1) % size;
        result.push(arr.slice(front).concat(arr.slice(0, front)));
    }
    return result;
}

export function zip(...args) {
    let options;
    let iterables;
    const last = args.at(-1);
    if (typeof last === "object" && last !== null && "strategy" in last) {
        options = last;
        iterables = args.slice(0, -1).map(iter);
    } else {
        options = {strategy: "shortest"};
        iterables = args.map(iter);
    }
    switch (options["strategy"]) {
        case "shortest":
            return zipShortest(iterables);
        case "longest":
            return zipLongest(iterables, options["fillValue"]);
        case "strict":
            return zipStrict(iterables);
        default:
            throw Error(`Unrecognised strategy: "${options}"`);
    }
}


function zipShortest(iterables) {
    const result = [];
    while (true) {
        const batch = [];
        for (const iter of iterables) {
            const next = iter.next();
            if (next.done) {
                return result;
            }
            batch.push(next.value);
        }
        result.push(batch);
    }
}

function zipLongest(iterables, fillValue) {
    const result = []
    while (true) {
        const batch = [];
        let done = 0;
        for (const iter of iterables) {
            const next = iter.next();
            if (next.done) {
                batch.push(fillValue);
                done += 1;
            } else {
                batch.push(next.value);
            }
        }
        if (done === iterables.length) {
            return result;
        } else {
            result.push(batch);
        }
    }
}

function zipStrict(iterables) {
    const result = []
    while (true) {
        const batch = [];
        let done = 0;
        for (const iter of iterables) {
            const next = iter.next();
            if (next.done) {
                done += 1;
            } else {
                batch.push(next.value);
            }
        }
        if (done === 0) {
            result.push(batch);
        } else if (done === iterables.length) {
            return result;
        } else {
            throw Error(
                "Zipped iterables of unequal length with strategy = strict",
            );
        }
    }
}