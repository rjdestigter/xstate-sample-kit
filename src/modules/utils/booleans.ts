/**
 * @packageDocumentation
 * @module utils
 */

 /**
 * ```hs
 * negate :: (a -> b) -> a -> Bool
 * ```
 *
 * Transforms a function from `a -> b` to `a -> boolean` by casting
 * it's result.
 * 
 * Example:
 * 
 * ```ts
 * const trim = (value: string) => value.trim();
 * 
 * const isEmpty = negate(trim)
 * 
 * ```
 * @param f The function of which the result is negated.
 * @typeparam T The function argument
 */
export const negate = <T>(f: (value: T) => any): (value: T) => boolean => value => !f(value)