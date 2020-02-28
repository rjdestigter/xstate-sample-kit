import { any } from "io-ts";

export const voidward = <T>(f: (value: T) => void) => (value: T) => {
  f(value)
  return value;
}

export const returnSecond = <T>(_: any, t: T) => t