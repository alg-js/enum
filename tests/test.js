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

import {
    assert,
    assertEquals,
    assertFalse,
    assertThrows,
} from "jsr:@std/assert@1";
import * as Enum from "../src/main.js";
import {
    alph,
    bang,
    num,
    temperamentalIter,
    toObjects,
    unwrap,
} from "./utils.js";


Deno.test({
    name: "All returns true for empty iterables",
    fn: () => assert(Enum.all([], (_) => false)),
});

Deno.test({
    name: "All returns true if all items satisfy a condition",
    fn: () => assert(Enum.all(alph(3), (_) => true)),
});

Deno.test({
    name: "All returns false if only some items satisfy a condition",
    fn: () => assertFalse(Enum.all(alph(3), (e) => e !== "b")),
});

Deno.test({
    name: "All returns false if no items satisfy a condition",
    fn: () => assertFalse(Enum.all(alph(3), (_) => false)),
});

Deno.test({
    name: "All stops early on false",
    fn: () => Enum.all(temperamentalIter(alph(3)), (e) => e !== "c"),
});

Deno.test({
    name: "Any returns false for empty iterables",
    fn: () => assertFalse(Enum.any([], (_) => false)),
});

Deno.test({
    name: "Any returns true if all items satisfy a condition",
    fn: () => assert(Enum.any(alph(3), (_) => true)),
});

Deno.test({
    name: "Any returns true when only some items satisfy a condition",
    fn: () => assert(Enum.any(alph(3), (e) => e === "b")),
});

Deno.test({
    name: "Any returns false if no items satisfy a condition",
    fn: () => assertFalse(Enum.any(alph(3), (_) => false)),
});


Deno.test({
    name: "Any stops early on true",
    fn: () => Enum.any(temperamentalIter(alph(3)), (e) => e === "c"),
});

Deno.test({
    name: "Chain will yield an empty iterable, when given empty iterables",
    fn: () => {
        assertEquals(Enum.chain([]), []);
        assertEquals(Enum.chain([], []), []);
        assertEquals(Enum.chain([], [], []), []);
    },
});

Deno.test({
    name: "Chain will yield an iterable",
    fn: () => assertEquals(Enum.chain(alph(3)), [...alph(3)]),
});

Deno.test({
    name: "Chain will yield an iterable padded with empty iterables",
    fn: () => {
        assertEquals(Enum.chain([], alph(3)), [...alph(3)]);
        assertEquals(Enum.chain(alph(3), []), [...alph(3)]);
        assertEquals(Enum.chain([], alph(3), []), [...alph(3)]);
    },
});

Deno.test({
    name: "Chain will chain multiple iterables",
    fn: () => assertEquals(
        Enum.chain(alph(3), num(3), ["foo", "bar", "baz"]),
        [...alph(3), ...num(3), "foo", "bar", "baz"],
    ),
});

Deno.test({
    name: "Chain is eager",
    fn: () => assertThrows(() => Enum.chain(num(3), temperamentalIter(num(3)))),
});

Deno.test({
    name: "Chunk yields nothing for empty iterables",
    fn: () => assertEquals(Enum.chunk([], 1), []),
});

Deno.test({
    name: "Chunk yields a single chunk",
    fn: () => assertEquals(Enum.chunk(alph(3), 3), [["a", "b", "c"]]),
});

Deno.test({
    name: "Chunk yields multiple chunks",
    fn: () => assertEquals(
        Enum.chunk(alph(6), 3),
        [["a", "b", "c"], ["d", "e", "f"]],
    ),
});

Deno.test({
    name: "Chunk discards leftovers",
    fn: () => {
        assertEquals(
            Enum.chunk(alph(8), 3),
            [["a", "b", "c"], ["d", "e", "f"]],
        );
        assertEquals(
            Enum.chunk(alph(8), 3, {strategy: "dropEnd"}),
            [["a", "b", "c"], ["d", "e", "f"]],
        );
    },
});

Deno.test({
    name: "Chunk pads leftovers",
    fn: () => {
        assertEquals(
            Enum.chunk(alph(8), 3, {strategy: "padEnd"}),
            [["a", "b", "c"], ["d", "e", "f"], ["g", "h", undefined]],
        );
        assertEquals(
            Enum.chunk(alph(9), 3, {strategy: "padEnd"}),
            [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"]],
        );
        assertEquals(
            Enum.chunk(alph(8), 3, {strategy: "padEnd", fillValue: "X"}),
            [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "X"]],
        );
    },
});

Deno.test({
    name: "Chunk keeps leftovers with `keepEnd`",
    fn: () => {
        assertEquals(
            Enum.chunk(alph(10), 3, {strategy: "keepEnd"}),
            [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"], ["j"]],
        );
        assertEquals(
            Enum.chunk(alph(8), 3, {strategy: "keepEnd"}),
            [["a", "b", "c"], ["d", "e", "f"], ["g", "h"]],
        );
    },
});

Deno.test({
    name: "Chunk throws with `strict`",
    fn: () => {
        assertThrows(() => Enum.chunk(alph(10), 3, {strategy: "strict"}));
        assertThrows(() => Enum.chunk(alph(8), 3, {strategy: "strict"}));
    },
});

Deno.test({
    name: "Chunk throws on <= 0 chunk size",
    fn: () => {
        assertThrows(() => Enum.chunk([], 0));
        assertThrows(() => Enum.chunk([], -1));
    },
});

Deno.test({
    name: "Chunk is eager",
    fn: () => assertThrows(() => Enum.chunk(temperamentalIter(alph(5)), 2)),
});

Deno.test({
    name: "Consume consumes iterables",
    fn: () => assertThrows(() => Enum.consume(temperamentalIter(alph(5)))),
});

Deno.test({
    name: "Consume consumes empty iterables",
    fn: () => {
        Enum.consume([]);
    },
});

Deno.test({
    name: "Dedup yields nothing when cycling an empty iterable",
    fn: () => assertEquals(Enum.dedup([]), []),
});

Deno.test({
    name: "Dedup yields an iterable if it has no duplicates",
    fn: () => assertEquals(Enum.dedup([1, 2, 3, 2, 1]), [1, 2, 3, 2, 1]),
});

Deno.test({
    name: "Dedup removes duplicates",
    fn: () => assertEquals(
        Enum.dedup([1, 2, 2, 3, 3, 3, 4]),
        [1, 2, 3, 4],
    ),
});

Deno.test({
    name: "Dedup compares objects",
    fn: () => assertEquals(
        unwrap(Enum.dedup(
            toObjects([1, 2, 2, 3, 3, 3, 4]),
            {eq: (left, right) => left.equals(right)},
        )),
        [1, 2, 3, 4],
    ),
});

Deno.test({
    name: "Dedup is eager",
    fn: () => assertThrows(() => Enum.dedup(temperamentalIter(alph(5)))),
});

Deno.test({
    name: "Drop drop nothing on empty iterators",
    fn: () => assertEquals(Enum.drop([], 3), []),
});

Deno.test({
    name: "Drop drop nothing when limit is 0",
    fn: () => assertEquals(Enum.drop(alph(3), 0), ["a", "b", "c"]),
});

Deno.test({
    name: "Drop drop the specified number of items",
    fn: () => assertEquals(Enum.drop(alph(3), 2), ["c"]),
});

Deno.test({
    name: "Drop will drop the entire iterable with limit === length",
    fn: () => assertEquals(Enum.drop(alph(3), 3), []),
});

Deno.test({
    name: "Drop will drop the entire iterable with limit > length",
    fn: () => assertEquals(Enum.drop(alph(3), 4), []),
});

Deno.test({
    name: "Drop is eager",
    fn: () => assertThrows(() => Enum.drop(temperamentalIter(alph(5)), 2)),
});

Deno.test({
    name: "DropWhile yields nothing for empty iterables",
    fn: () => assertEquals(Enum.dropWhile([], (_) => true), []),
});

Deno.test({
    name: "DropWhile yields nothing with tautologies",
    fn: () => assertEquals(Enum.dropWhile(alph(3), (_) => true), []),
});

Deno.test({
    name: "DropWhile yields everything with contradictions",
    fn: () => assertEquals(
        Enum.dropWhile(alph(3), (_) => false),
        ["a", "b", "c"],
    ),
});

Deno.test({
    name: "DropWhile drops values based on the given predicate",
    fn: () => assertEquals(
        Enum.dropWhile(alph(3), (e) => e === "a"),
        ["b", "c"],
    ),
});

Deno.test({
    name: "DropWhile is eager",
    fn: () => assertThrows(() =>
        Enum.dropWhile(temperamentalIter(num(3)), (e) => e === "a"),
    ),
});

Deno.test({
    name: "DropWhile predicates take an index",
    fn: () => assertEquals(
        Enum.dropWhile(alph(4), (_, i) => i <= 1),
        ["c", "d"],
    ),
});

Deno.test({
    name: "Filtering values in empty iterables yields an empty iterable",
    fn: () => assertEquals(Enum.filter([], (_) => true), []),
});

Deno.test({
    name: "Filtering values with contradictions yields an empty iterable",
    fn: () => assertEquals(Enum.filter(num(3), (_) => false), []),
});

Deno.test({
    name: "Filtering values with tautologies yields the original iterable",
    fn: () => assertEquals(Enum.filter(num(3), (_) => true), [0, 1, 2]),
});

Deno.test({
    name: "Values can be filtered",
    fn: () => assertEquals(
        Enum.filter(num(6), (e) => e % 2 === 0),
        [0, 2, 4],
    ),
});

Deno.test({
    name: "Filter is eager",
    fn: () => assertThrows(() =>
        Enum.filter(temperamentalIter(num(5)), (e) => e % 2 === 0),
    ),
});

Deno.test({
    name: "Filter predicates take an index",
    fn: () => assertEquals(
        Enum.filter(alph(6), (_, i) => i % 2 === 0),
        ["a", "c", "e"],
    ),
});

Deno.test({
    name: "Finding values in empty iterables returns undefined",
    fn: () => assertEquals(Enum.find([], (_) => true), undefined),
});

Deno.test({
    name: "Finding existing values in iterables returns the value",
    fn: () => assertEquals(Enum.find(alph(5), (e) => e === "c"), "c"),
});

Deno.test({
    name: "Finding yields the first instance",
    fn: () => assertEquals(Enum.find(alph(5), (e) => e.length === 1), "a"),
});

Deno.test({
    name: "Finding non-existing values in iterables returns undefined",
    fn: () => assertEquals(Enum.find(alph(3), (e) => e === "d"), undefined),
});

Deno.test({
    name: "Find stops early when found",
    fn: () => Enum.find(temperamentalIter(alph(3)), (e) => e === "c"),
});

Deno.test({
    name: "Find takes an index",
    fn: () => assertEquals(Enum.find(alph(3), (_, i) => i === 2), "c"),
});

Deno.test({
    name: "Finding indices in empty iterables returns -1",
    fn: () => assertEquals(Enum.findIndex([], (_) => true), -1),
});

Deno.test({
    name: "Finding existing indices in empty iterables returns the index",
    fn: () => assertEquals(Enum.findIndex(alph(5), (e) => e === "c"), 2),
});

Deno.test({
    name: "Finding non-existing indices in empty iterables returns -1",
    fn: () => assertEquals(Enum.findIndex(alph(3), (e) => e === "d"), -1),
});

Deno.test({
    name: "Find index stops early when found",
    fn: () => {
        Enum.findIndex(temperamentalIter(alph(3)), (e) => e === "c");
    },
});

Deno.test({
    name: "Find index takes an index",
    fn: () => assertEquals(Enum.findIndex(alph(3), (_, i) => i === 2), 2),
});

Deno.test({
    name: "Flat Mapping values in empty iterables yields an empty iterable",
    fn: () => assertEquals(Enum.flatMap([], (_) => alph(3)), []),
});

Deno.test({
    name: "Flat Mapping values to empty iterables yields an empty iterable",
    fn: () => assertEquals(Enum.flatMap(alph(3), (_) => []), []),
});

Deno.test({
    name: "Values can be flat mapped",
    fn: () => assertEquals(
        Enum.flatMap(num(3), (e) => [e, -e]),
        [0, 0, 1, -1, 2, -2],
    ),
});

Deno.test({
    name: "FlatMap mappings take an index",
    fn: () => assertEquals(
        Enum.flatMap(alph(3), (_, i) => [i, -i]),
        [0, 0, 1, -1, 2, -2],
    ),
});

Deno.test({
    name: "For each consumes nothing on empty iterables",
    fn: () => Enum.forEach([], bang),
});

Deno.test({
    name: "For each consumes iterables",
    fn: () => assertThrows(() =>
        Enum.forEach(temperamentalIter(num(3)), () => true),
    ),
});

Deno.test({
    name: "For each consumes elements in iterables",
    fn: () => assertThrows(() => Enum.forEach(num(3), bang)),
});

Deno.test({
    name: "For each takes an index",
    fn: () => {
        const result = [];
        Enum.forEach(alph(3), (_, i) => result.push(i));
        assertEquals(result, [0, 1, 2]);
    },
});

Deno.test({
    name: "Length takes the length of iterables",
    fn: () => assertEquals(Enum.length([1, 2, 3]), 3),
});

Deno.test({
    name: "Length takes the length of iterators",
    fn: () => assertEquals(Enum.length(alph(3)), 3),
});

Deno.test({
    name: "Length takes the length empty iterators",
    fn: () => assertEquals(Enum.length([]), 0),
});

Deno.test({
    name: "Mapping values in empty iterables returns an empty array",
    fn: () => assertEquals(Enum.map([], bang), []),
});

Deno.test({
    name: "Values can be mapped",
    fn: () => assertEquals(Enum.map(num(3), (e) => e * 2), [0, 2, 4]),
});

Deno.test({
    name: "Map is eager",
    fn: () => assertThrows(() => Enum.map(temperamentalIter(num(5)), (e) => e)),
});

Deno.test({
    name: "Map functions take an index",
    fn: () => assertEquals(
        Enum.map(alph(3), (e, i) => e.repeat(i + 1)),
        ["a", "bb", "ccc"],
    ),
});

Deno.test({
    name: "Reducing an empty iterable with no initial value throws",
    fn: () => assertThrows(() => Enum.reduce([], (a, e) => a + e)),
});

Deno.test({
    name: "Reducing empty iterables with an initial value returns the initial",
    fn: () => assertEquals(Enum.reduce([], (a, e) => a + e, "a"), "a"),
});

Deno.test({
    name: "Reducing iterables with no initial value returns the reduced values",
    fn: () => assertEquals(Enum.reduce(num(5), (a, e) => a + e), 10),
});

Deno.test({
    name: "Reducing iterables with an initial value returns the reduced values",
    fn: () => assertEquals(Enum.reduce(num(5), (a, e) => a + e, 10), 20),
});

Deno.test({
    name: "Repeat will repeat an object n times",
    fn: () => assertEquals(Enum.repeat("a", 4), ["a", "a", "a", "a"]),
});

Deno.test({
    name: "Repeat will repeat an object 0 times",
    fn: () => assertEquals(Enum.repeat("a", 0), []),
});

Deno.test({
    name: "Reverse reverses empty iterables",
    fn: () => assertEquals(Enum.reverse([]), []),
});

Deno.test({
    name: "Reverse reverses an iterable with one item",
    fn: () => assertEquals(Enum.reverse(["a"]), ["a"]),
});

Deno.test({
    name: "Reverse reverses an iterable with two items",
    fn: () => assertEquals(Enum.reverse(["a", "b"]), ["b", "a"]),
});

Deno.test({
    name: "Reverse reverses an iterable with an even number of items",
    fn: () => assertEquals(Enum.reverse(alph(4)), ["d", "c", "b", "a"]),
});

Deno.test({
    name: "Reverse reverses an iterable with an odd number of items",
    fn: () => assertEquals(Enum.reverse(alph(5)), ["e", "d", "c", "b", "a"]),
});

Deno.test({
    name: "Scan yields nothing on empty iterables",
    fn: () => assertEquals(Enum.scan([], bang), []),
});

Deno.test({
    name: "Scan does not yield the initial value when given",
    fn: () => assertEquals(Enum.scan([], bang, "a"), []),
});

Deno.test({
    name: "Scan yields the first value of the iterable",
    fn: () => assertEquals(Enum.scan(["a"], bang), ["a"]),
});

Deno.test({
    name: "Scan accumulates values",
    fn: () => assertEquals(
        Enum.scan(alph(4), (a, e) => a + e),
        ["a", "ab", "abc", "abcd"],
    ),
});

Deno.test({
    name: "Scan accumulator takes an index",
    fn: () => assertEquals(
        Enum.scan(alph(4), (a, e, i) => a + e + i),
        ["a", "ab1", "ab1c2", "ab1c2d3"],
    ),
});

Deno.test({
    name: "Scan accumulator index is adjusted for initial values",
    fn: () => assertEquals(
        Enum.scan(alph(4), (a, e, i) => a + e + i, "X"),
        ["Xa0", "Xa0b1", "Xa0b1c2", "Xa0b1c2d3"],
    ),
});

Deno.test({
    name: "Scan is eager",
    fn: () => assertThrows(() => scan(temperamentalIter(num(3)), (e) => e)),
});

Deno.test({
    name: "Take will take nothing from an empty iterator",
    fn: () => assertEquals(Enum.take([], 1), []),
});

Deno.test({
    name: "Take will take nothing from an iterator with n of 0",
    fn: () => assertEquals(Enum.take(alph(3), 0), []),
});

Deno.test({
    name: "Take will take the whole iterator when n is out of bounds",
    fn: () => assertEquals(Enum.take(alph(3), 10), ["a", "b", "c"]),
});

Deno.test({
    name: "Take will take one value",
    fn: () => assertEquals(Enum.take(alph(3), 1), ["a"]),
});

Deno.test({
    name: "Take will take several values",
    fn: () => assertEquals(Enum.take(alph(3), 2), ["a", "b"]),
});

Deno.test({
    name: "take is lazy",
    fn: () => assertThrows(() => Enum.take(temperamentalIter(alph(3)), 4)),
});

Deno.test({
    name: "Take while will take nothing from an empty iterator",
    fn: () => assertEquals(Enum.takeWhile([], (_) => true), []),
});

Deno.test({
    name: "Take while will take nothing from an iterator with a contradiction",
    fn: () => assertEquals(Enum.takeWhile(alph(3), (_) => false), []),
});

Deno.test({
    name: "Take while will take the whole iterator with a tautology",
    fn: () => assertEquals(
        Enum.takeWhile(alph(3), (_) => true),
        ["a", "b", "c"],
    ),
});

Deno.test({
    name: "Take while will take one value",
    fn: () => assertEquals(
        Enum.takeWhile(alph(3), (e) => e === "a"),
        ["a"],
    ),
});

Deno.test({
    name: "Take while will take several values",
    fn: () => assertEquals(
        Enum.takeWhile(alph(3), (e) => e !== "c"),
        ["a", "b"],
    ),
});

Deno.test({
    name: "TakeWhile is eager",
    fn: () => assertThrows(() =>
        Enum.takeWhile(temperamentalIter(num(3)), () => true),
    ),
});

Deno.test({
    name: "TakeWhile predicates take an index",
    fn: () => assertEquals(
        Enum.takeWhile(alph(3), (_, i) => i < 2),
        ["a", "b"],
    ),
});

Deno.test({
    name: "Iterables can be windowed",
    fn: () => {
        assertEquals(Enum.window(alph(1), 1), [["a"]]);
        assertEquals(Enum.window(alph(2), 1), [["a"], ["b"]]);
        assertEquals(Enum.window(alph(2), 2), [["a", "b"]]);
        assertEquals(Enum.window(alph(3), 2), [["a", "b"], ["b", "c"]]);
        assertEquals(Enum.window(alph(4), 4), [["a", "b", "c", "d"]]);
    },
});

Deno.test({
    name: "Windowed Enums with a size greater than the iterable yield nothing",
    fn: () => {
        assertEquals(Enum.window(alph(0), 1), []);
        assertEquals(Enum.window(alph(4), 5), []);
    },
});

Deno.test({
    name: "Windowed iterators with a size of 0 throw",
    fn: () => {
        assertThrows(() => Enum.window(alph(5), 0));
    },
});

Deno.test({
    name: "Windowed is eager",
    fn: () => assertThrows(() => Enum.window(temperamentalIter(num(4)), 2)),
});

Deno.test({
    name: "Zip returns an empty iterator when given nothing to zip",
    fn: () => assertEquals(Enum.zip([]), []),
});

Deno.test({
    name: "Zip returns an empty iterator when any iterator is empty",
    fn: () => assertEquals(Enum.zip(alph(3), num(3), []), []),
});

Deno.test({
    name: "Zip returns single values when zipping a single iterator",
    fn: () => assertEquals(Enum.zip(alph(3)), [["a"], ["b"], ["c"]]),
});

Deno.test({
    name: "Zip returns an iterator when zipping a multiple iterators",
    fn: () => assertEquals(
        Enum.zip(alph(3), num(3)),
        [["a", 0], ["b", 1], ["c", 2]],
    ),
});

Deno.test({
    name: "Zip stops on the shortest iterator",
    fn: () => {
        assertEquals(
            Enum.zip(alph(4), num(3)),
            [["a", 0], ["b", 1], ["c", 2]],
        )
        assertEquals(
            Enum.zip(alph(4), num(3), {strategy: "shortest"}),
            [["a", 0], ["b", 1], ["c", 2]],
        )
    },
});

Deno.test({
    name: "Zip stops on the longest iterator with strategy longest",
    fn: () => {
        assertEquals(
            Enum.zip(alph(4), num(3), {strategy: "longest"}),
            [["a", 0], ["b", 1], ["c", 2], ["d", undefined]],
        );
        assertEquals(
            Enum.zip(alph(4), num(3), {
                strategy: "longest",
                fillValue: "foo",
            }),
            [["a", 0], ["b", 1], ["c", 2], ["d", "foo"]],
        );
    },
});

Deno.test({
    name: "Zip throws on uneven iterators with strategy strict",
    fn: () => {
        assertThrows(() => Enum.zip(alph(4), num(3), {strategy: "strict"}));
    },
});

Deno.test({
    name: "Zip yields even iterators with strategy strict",
    fn: () => assertEquals(
        Enum.zip(alph(3), num(3), {strategy: "strict"}),
        [["a", 0], ["b", 1], ["c", 2]],
    ),
});

Deno.test({
    name: "Zip throws on unrecognised strategy",
    fn: () => {
        assertThrows(() => Enum.zip(alph(4), num(3), {strategy: "foo"}));
    },
});

Deno.test({
    name: "Zip is eager",
    fn: () => assertThrows(() => Enum.zip(temperamentalIter(num(3)), num(3))),
});
