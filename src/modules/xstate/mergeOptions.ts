import { MachineOptions, EventObject } from "xstate";

const mergeOptions = <
  TContextA,
  TEventA extends EventObject,
  TContextB,
  TEventB extends EventObject
>(
  a: Partial<MachineOptions<TContextA, TEventA>>,
  b: Partial<MachineOptions<TContextB, TEventB>>
): Partial<MachineOptions<TContextA & TContextB, TEventA | TEventB>> =>
  Object.keys({ ...a, ...b }).reduce(
    (acc, key) => ({
      ...acc,
      [key]: {
        ...((a as any)[key] || {}),
        ...((b as any)[key] || {})
      }
    }),
    {} as any
  );

export default mergeOptions;
