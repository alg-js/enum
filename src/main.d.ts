/* Copyright 2025 James Finnie-Ansley
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


/**
 * A function that returns a truthy or falsy value
 */
export type Predicate<T> = (e: T, i?: number) => boolean;
/**
 * A function that maps the given value
 */
export type Mapping<T, R> = (e: T, i?: number) => R;
/**
 * A function that performs some operation and returns nothing
 */
export type Consumer<T> = (e: T, i?: number) => void;
/**
 * A function that updates the given value
 */
export type Update<T> = (e: T, i?: number) => T;
/**
 * A function that accumulates values
 */
export type Folder<T, R> = (acc: R, e: T, i?: number) => R;
/**
 * A function that accumulates values
 */
export type Reducer<T> = (acc: T, e: T, i?: number) => T;

/**
 * Returns ture if all items in the iterable satisfy the predicate.
 * Empty iterables return true.
 *
 * @example
 * ```javascript
 * const result = Enum.all([1, 2, 3, 4], (e) => e > 0);
 * console.log(result);  // true
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An Iterable
 * @param {Predicate<T>} predicate A predicate
 */
export function all<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): boolean;

/**
 * Returns true if any items in the iterable satisfy the predicate.
 * Empty iterables return false.
 *
 * @example
 * ```javascript
 * const result = Enum.any([1, 2, 3, 4], (e) => e < 0);
 * console.log(result);  // false
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An Iterable
 * @param {Predicate<T>} predicate A predicate
 */
export function any<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): boolean;

/**
 * Chains the given iterables.
 *
 * @example
 * ```javascript
 * const result = Enum.chain([1, 2, 3], ["a", "b", "c"])
 * console.log(result);  // [1, 2, 3, "a", "b", "c"]
 * ```
 *
 * @template T
 * @param {...Iterable<T>} iterables one or more iterables
 * @returns {T[]} The values from the given iterables chained together
 */
export function chain<T>(
  ...iterables: Iterable<T>[]
): T[];

/**
 * Splits the given iterable into arrays of the given size. Drops any dangling
 * elements.
 *
 * @example
 * ```javascript
 * console.log(Enum.chunk([1, 2, 3, 4, 5], 2));  // [[1, 2] [3, 4]]
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {number} size The size of the chunk window
 * @returns {T[][]} Chunks of the given size
 */
export function chunk<T>(
  iterable: Iterable<T>,
  size: number,
): T[][];


/**
 * Consumes the given iterable
 *
 * @example
 * ```javascript
 * const iter = [1, 2, 3][Symbol.iterator]();
 * Enum.consume(iter);
 * console.log(iter.next().done);  // true
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 */
export function consume<T>(
  iterable: Iterable<T>,
): void;

/**
 * Deduplicates items in the given iterable — that is, replaces any contiguous
 * sequences of the same element with only one occurrence of that element.
 *
 * `options` is an object defining an `eq` function that takes two parameters
 * and determines equality. Uses strict equality by default.
 *
 * @example
 * ```javascript
 * const data = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 2, 2, 1];
 * console.log(Enum.dedup(data));  // [1, 2, 3, 4, 3, 2, 1]
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {{eq: (e1: T, e2: T) => boolean}} options
 * @returns {T[]} An array of deduplicated values
 */
export function dedup<T>(
    iterable: Iterable<T>,
    options?: { eq?: (e1: T, e2: T) => boolean },
): T[];

/**
 * Drops the given number of items from the iterable.
 * Returns an array of all elements thenceforth.
 * If the given limit is greater than the number of items in the iterable, an
 * array of all items is returned.
 *
 * @example
 * ```javascript
 * const values = ["a", "b", "c", "d", "e", "f", "g"];
 * console.log(Enum.drop(values, 3));  // ["d", "e", "f", "g"]
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {number} limit The number of items to drop from the start of the
 *  given iterable
 * @returns {T[]} An array of values after `limit` values have been dropped
 */
export function drop<T>(
    iterable: Iterable<T>,
    limit: number,
): T[];

/**
 * Drops elements from the given iterable while the predicate is true.
 * Yields all elements thenceforth.
 *
 * @example
 * ```javascript
 * const values = ["a", "b", "c", "d", "e", "f", "g"];
 * const predicate = (e) => "abc efg".includes(e);
 * console.log(Enum.dropWhile(values, predicate));  // ["d", "e", "f", "g"]
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {Predicate<T>} predicate A predicate that takes a value and index
 * @returns {T[]} An array of values from the first value that does
 *  not satisfy the given predicate
 */
export function dropWhile<T>(
    iterable: Iterable<T>,
    predicate: Predicate<T>,
): T[];

/**
 * Filters the iterable using the given predicate
 *
 * @example
 * ```javascript
 * const values = ["foo", "bar", "foobar", "baz"];
 * const result = Enum.filter(values, (e) => e.length === 3);
 * console.log(result);  // ["foo", "bar", "baz"]
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {Predicate<T>} predicate A predicate that takes a value and index
 * @returns {T[]} All values that satisfy the given predicate
 */
export function filter<T>(
    iterable: Iterable<T>,
    predicate: Predicate<T>,
): T[];

/**
 * Finds the first item that satisfies the given predicate.
 *
 * @example
 * ```javascript
 * const values = ["foo", "bar", "foobar", "baz"];
 * const result = Enum.find(values, (e) => e.length > 3);
 * console.log(result);  // foobar
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {Predicate<T>} predicate A predicate
 * @returns {T} the first item matching the given condition
 */
export function find<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): T;

/**
 * Finds the index of the first item that satisfies the given predicate.
 *
 * @example
 * ```javascript
 * const values = ["foo", "bar", "foobar", "baz"];
 * const result = Enum.findIndex(values, (e) => e.length > 3);
 * console.log(result);  // 2
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable
 * @param {Predicate<T>} predicate
 * @returns {number}
 */
export function findIndex<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>,
): number;

/**
 * Maps the given iterable into a nested iterables and flattens the result.
 *
 * @example
 * ```javascript
 * const database = ["foo", "baz", "bar"];
 * const indices = [0, 2];
 * const result = Enum.flatMap(indices, (e) => database[e]);
 * console.log(result);  // ["f", "o", "o", "b", "a", "r"]
 * ```
 *
 * @template T
 * @template R
 * @param {Iterable<T>} iterable An iterable
 * @param {Mapping<T, Iterable<R>>} mapping A mapping function that maps values
 *  and indices to iterables
 * @returns {R[]} the results of the mapping function flattened
 */
export function flatMap<T, R>(
    iterable: Iterable<T>,
    mapping: Mapping<T, Iterable<R>>,
): R[];

/**
 * Applies the given consumer to each item.
 *
 * @example
 * ```javascript
 * const data = ["foo", "bar"];
 * Enum.forEach(data, (e) => console.info(e));  // "foo" \ "bar"
 * ```
 *
 * @template T
 * @param {Consumer<T>}consumer
 */
export function forEach<T>(
    consumer: Consumer<T>,
): void;

/**
 * Returns the length of the given iterable.
 *
 * @example
 * ```javascript
 * const data = ["a", "b", "c"][Symbol.iterator]();
 * console.log(Enum.length(data));  // 3
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable
 * @returns {number}
 */
export function length<T>(
    iterable: Iterable<T>,
): number;

/**
 * Maps the given iterable with the given mapping function.
 *
 * @example
 * ```javascript
 * const data = ["a", "b", "c"];
 * const duplicate = (e, i) => e.repeat(i + 1);
 * console.log(Enum.map(data, duplicate));  // ["a", "bb", "ccc"]
 * ```
 *
 * @template T
 * @template R
 * @param {Iterable<T>} iterable An iterable
 * @param {Mapping<T, R>} mapping A function that maps elements with an
 *  element and index
 * @returns {R[]} The items from {@link iterable} mapped.
 */
export function map<T, R>(
    iterable: Iterable<T>,
    mapping: Mapping<T, R>,
): R[];

/**
 * Reduces the given iterable with the given reducer function.
 *
 * @example
 * ```javascript
 * const data = ["foo", "bar", "baz"];
 * const result = Enum.reduce(data, (a, e) => a + e);
 * console.log(result);  // foobarbaz
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An Iterable
 * @param {Reducer<T>} reducer A reducer function
 * @returns {T}
 */
export function reduce<T>(
  iterable: Iterable<T>,
  reducer: Reducer<T>,
): T;

/**
 * Folds the given iterable with the initial value.
 *
 * @example
 * ```javascript
 * const data = ["foo", "bar", "baz"];
 * const result = Enum.reduce(data, (a, e) => a + e.length, 0);
 * console.log(result);  // 9
 * ```
 *
 * @template T
 * @template R
 * @param {Iterable<T>} iterable An iterable
 * @param {Folder<T, R>} reducer A folding function
 * @param {R} initial An initial value
 */
export function reduce<T, R>(
  iterable: Iterable<T>,
  reducer: Folder<T, R>,
  initial: R,
): R;

/**
 * Yields the given object the given number of times. This is a shallow copy
 * and not a structured clone.
 *
 * @example
 * ```javascript
 * console.log(Enum.repeat("foo", 3));  // ["foo", "foo", "foo"]
 * ```
 *
 * @template T
 * @param {T} object The object to repeat
 * @param {number} times The number of times to repeat the object
 * @returns {T[]} An array containing `object` the given number of times
 */
export function repeat<T>(
    object: T,
    times: number,
): T[];


/**
 * Reverses the given iterable
 *
 * @example
 * ```javascript
 * const data = ["a", "b", "c"];
 * console.log(Enum.reverse(data));  // ["c", "b", "a"]
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable
 * @returns T[]
 */
export function reverse<T>(
    iterable: Iterable<T>
): T[];

/**
 * Reduces the given iterable and returns an array containing the reduction for
 * each element.
 *
 * @example
 * ```javascript
 * const data = [1, 2, 3, 4];
 * console.log(Enum.scan(data, (a, e) => a + e));  // [1, 3, 6, 10]
 * ```
 *
 * @param iterable
 * @param accumulator
 */
export function scan<T>(
    iterable: Iterable<T>,
    accumulator: Reducer<T>,
): T[];

/**
 * Folds the given iterable and returns an array containing the reduction for
 * each element.
 *
 * @example
 * ```javascript
 * const data = ["foo", "bar", "baz"];
 * console.log(Enum.scan(data, (a, e) => a + e.length, 0));  // [3, 6, 9]
 * ```
 *
 * @template T
 * @template R
 * @param {Iterable<T>} iterable
 * @param {Folder<T, R>} accumulator
 * @param {R} initial
 * @returns {R[]}
 */
export function scan<T, R>(
    iterable: Iterable<T>,
    accumulator: Folder<T, R>,
    initial: R,
): R[];

/**
 * Takes and yields the first `limit` items from the iterable
 *
 * @example
 * ```javascript
 * const data = ["foo", "bar", "baz", "foobar"];
 * console.log(Enum.take(data, 2));  // ["foo", "bar"]
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An iterable
 * @param {number} limit The number of items to take
 * @returns {T[]} An array with the first {@link limit} items from
 *  {@link iterable}.
 */
export function take<T>(
    iterable: Iterable<T>,
    limit: number,
): T[];

/**
 * Returns the values from the given iterable while the predicate is satisfied.
 *
 * @example
 * ```javascript
 * const letters = "abcdefg";
 * const predicate = (e) => "abc efg".includes(e);
 * console.log(Enum.takeWhile(letters, predicate));  // ["a", "b", "c"]
 * ```
 */
export function takeWhile<T>(
    iterable: Iterable<T>,
    predicate: Predicate<T>,
): T[];

/**
 * Returns sliding windows over the iterator.
 * If the given size is larger than the length of the iterator, nothing is
 * yielded.
 *
 * @example
 * ```javascript
 * const letters = "abcde";
 * console.log(Enum.window(letters, 3));
 * // [["a", "b", "c"], ["b", "c", "d"], ["c", "d", "e"]]
 * ```
 * @example
 * ```javascript
 * const letters = "abcde";
 * console.log(Enum.window(letters, 1000));  // []
 * ```
 *
 * @template T
 * @param {Iterable<T>} iterable An Iterable
 * @param {number} size The size of the sliding window
 * @returns {T[][]} An iterator of windows
 * @throws {Error} if the given size is 0
 */
export function window<T>(
    iterable: Iterable<T>,
    size: number,
):T[][];

/**
 * Zips the given iterables. Stops once the shortest iterable has been consumed.
 *
 * @example
 * ```javascript
 * const nums = [0, 1, 2, 3, 4];
 * const alph = "abcd";
 * const foos = ["foo", "bar", "baz"];
 *
 * console.log(Enum.zip(nums, alph, foos));
 * // [[0, "a", "foo"] ,[1, "b", "bar"], [2, "c", "baz"]]
 * ```
 *
 * @template T
 * @param {Iterable<T>[]} iterables
 * @returns {T[][]}
 */
export function zip<T>(
    ...iterables: Iterable<T>[]
): T[][];
