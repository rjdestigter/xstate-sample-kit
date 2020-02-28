/**
 * @packageDocumentation
 * @module utils
 */

/**
 * Type that describes a function that returns
 * the value of on object's property given
 * 
 * @typeparam TKey The key or property name the function should read and return from a given object.
 * @typeparam TValue The value type
 * @typeparam TObject The object type
 */
export type Getter<TKey extends string> = <
  TValue,
  TObject extends {
    [P in TKey]: TValue;
  }
>(
  o: TObject
) => TObject[TKey];

/**
 * 
 * @param key 
 */
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


export const getEventCurrentTargetValue = getter2("currentTarget", "value")

export const dot = getter

export const dot2 = getter2