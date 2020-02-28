import { pipe } from "fp-ts/lib/pipeable";
import * as S from "fp-ts/lib/Semigroup";
import * as O from "fp-ts/lib/Option";
import { Predicate } from "fp-ts/lib/function";
​
const semigroupPredicate = S.getFunctionSemigroup(S.semigroupAll)<number>();
​
const isValidNumber = semigroupPredicate.concat(
  x => typeof x === "number",
  x => !isNaN(x)
);
​
const every = <A>(p: Predicate<A>) => (as: Array<A>): boolean => {
  // return S.fold(S.semigroupAll)(true, as.map(p));
  return true;
};
​
const areAllValids = every(isValidNumber);
​
const value = pipe(
  [1, 2, NaN] as [number, number, number],
  O.fromPredicate(areAllValids),
);

