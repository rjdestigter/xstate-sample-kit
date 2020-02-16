export type Getter<K extends string> = <
  T,
  O extends {
    [P in K]: T;
  }
>(
  o: O
) => O[K];

export const getter = <K extends string>(key: K): Getter<K> => <
  T,
  O extends { [P in K]: T }
>(
  o: O
) => o[key];

export const getter2 = <K1 extends string, K2 extends string>(
  k1: K1,
  k2: K2
) => <T, O extends { [P in K1]: { [R in K2]: T } }>(o: O) => o[k1][k2];
