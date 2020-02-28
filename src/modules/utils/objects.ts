/**
 * @packageDocumentation
 * @module utils
 */

import { NeededUnionType } from "../types";

/**
 * Return type of the [[pick]]. A function that takes object O
 * and picks keys  K from it.
 * 
 *  * Example:
 * 
 * ```ts
 * const { a, b } = pick('a', 'b')({ a: 12, b: true, c: "hello"})
 * 
 * ```
 * 
 * @typeparam K List of keys of object O
 * @typeparam O The object to pick keys K from.
 */
export type Picker<K extends string[]> = <
  O extends { [P in NeededUnionType<K>]: any }
>(
  object: O
) => Pick<O, NeededUnionType<K>>;

/**
 * Pick a set of key/values from an object.
 * 
 * Example:
 * 
 * ```ts
 * const { a, b } = pick('a', 'b')({ a: 12, b: true, c: "hello"})
 * ```
 * 
 * @param keys List of keys to be picked.
 * @typeparam K List of keys of object O
 * @returns `pick` is curried. It returns a function that takes the object to pick from.
 */
export const pick = <K extends string[]>(...keys: K): Picker<K> => object =>
  Object.keys(object).reduce((acc, key) => {
    if (keys.includes(key)) {
      acc[key] = object[key as keyof object];
    }

    return acc;
  }, {} as any);
