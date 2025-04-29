

export function alph(n) {
    return "abcdefghijklmnopqrstuvwxyz".slice(0, n)[Symbol.iterator]();
}

export function* num(n) {
    for (let i = 0; i < n; i++) {
        yield i;
    }
}

/**
 * An iterator that goes out with a bang.
 *
 * @param iter
 * @returns {Generator<*, void, *>}
 * @throws {Error} when the iterator has been fully consumed
 */
export function* temperamentalIter(iter) {
    yield* iter;
    throw new Error("Bang!");
}

class Foo {
    constructor(value) {
        this.value = value;
    }

    equals(other) {
        return other instanceof Foo && this.value === other.value
    }
}

export function toObjects(values) {
    return values.map((e) => new Foo(e));
}

export function unwrap(values) {
    return values.map((e) => e.value);
}

/**
 * A function that should not be called
 */
export function bang() {
    throw new Error("This should never happen");
}