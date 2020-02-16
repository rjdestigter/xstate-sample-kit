type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

export type DropFirstInTuple<T extends any[]> = ((...args: T) => any) extends (arg: any, ...rest: infer U) => any ? U : T;

export type PropsOf<C extends React.ComponentType<any>> = C extends React.ComponentType<infer P>
  ? P
  : never;
