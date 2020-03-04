 /**
 * @packageDocumentation
 * @module utils
 */
import * as S from 'fp-ts/lib/Semigroup'
 
 /**
  * Read https://dev.to/gcanti/getting-started-with-fp-ts-semigroup-2mf7
  * for better understanding of semigroups in fp-ts
  */

 /**
   * Semigroup for concatanating values that are
   * functions from `string -> boolean`
   * 
   * ```hs
   * semigroupPredict :: Semigroup ((string | undefined) -> boolean)
   * ```
   */
  export const semigroupPredicate = S.getFunctionSemigroup(S.semigroupAll)<
    string | undefined
  >();