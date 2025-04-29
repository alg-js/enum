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

export function chunk(iterable, size) {
    if (size === 0) {
        throw new Error("Cannot yield chunks of size 0");
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

export function zip(...iterables) {
    iterables = iterables.map(iter);
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
