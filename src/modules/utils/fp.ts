/**
 * @packageDocumentation
 * @module utils
 */
import { Option, fold as foldOption } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { identity, constant } from "fp-ts/lib/function";

/**
 * 
 * @param maybe 
 */
export const foldMaybe = <T>(maybe: Option<T>) => (base: T) => pipe(
  maybe,
  foldOption(constant(base), identity)
)

/**
 * 
 * @param maybe 
 */
export const foldValue = <T>(base: T) => (maybe: Option<T>) => pipe(
  maybe,
  foldOption(constant(base), identity)
)

/**
 * 
 * @param maybe 
 */
export const foldString = foldValue("")

