/**
 * @packageDocumentation
 * @module utils
 */

 /**
 * ```hs
 * forward :: (a -> b) -> a -> a
 * ```
 * 
 * Transforms a function with a signature of `a -> b` into an
 * identity function of `a`
 * 
 * Example:
 * 
 * ```ts
 * declare const dispatch = (event: Event) => void
 * 
 * const eventIdentity = forward(dispatch)
 * 
 * const event: Event = eventIdentity(new Event())
 * ```
 * 
 * 
 * @param f The function 
 */
export const forward = <T>(f: (value: T) => any): (value: T) => T => value => {
  f(value);
  return value;
};

/**
 * ```hs
 * returnSecond :: a -> b -> b
 * ```
 * 
 * Returns the second argument given.
 * 
 * Example:
 * 
 * ```ts
 * import { flow } from 'fp-ts/lib/functions'
 * 
 * const double: (a: any, b: number) => number = flow(
 *   returnSecond,
 *   (n: number) => n * 2
 * )
 * 
 * const result = double("Anything here", 10) // 20
 * 
 * const promiseThatRejects = new Promise<13>(
 *   flow(returnSecond, reject => reject())
 * )
 * 
 * ```
 * 
 * As you can see, `returnSecond` is especially helpful in combination with
 * `fp-ts`' `flow` function.
 * 
 * 
 * @param _ Anything, first argument is ignored
 * @param t Second argument that is also returned.
 * @returns The second argument.
 * @typeparam T The type of the second argument.
 */
export const returnSecond = <T>(_: any, t: T, ...rest: any[]) => t;

/**
 * ```hs
 * voidFn :: ()
 * ```
 * 
 * A void function. A lazy volue of nothing!
 * It takes nothing. It does nothing. It's useless.
 * 
 */
export const voidFn = () => {};

/**
 * ```hs
 * returnLast :: (a -> b) -> (a -> c) -> a -> c
 * ```
 * 
 * Takes 2 functions that both accept the same argument and 
 * executes both but only returns the value of the second
 * function.
 * 
 * Example:
 * 
 * ```ts
 * 
 * import { identity } from 'fp-ts/lib/functions'
 * 
 * declare const update: (value: string) => void
 * 
 * const updateAndReturn = returnLast(update, identity)
 * ```
 * 
 * @param f1 The first function that is called.
 * @param f2 The second function whos return value is returned.
 * @typeparam A The type of the incoming value passed to both f1 and f2.
 * @typeparam B The return type of the second function.
 * @returns A function that takes argument `A` and returns the result of the second function.
 */
export const returnLast = <A, B>(f1: (a: A) => any, f2: (a: A) => B): (a: A) => B => (
  a: A
) => {
  f1(a);
  return f2(a);
};


