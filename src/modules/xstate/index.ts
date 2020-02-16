import { DoneInvokeEvent } from "xstate";

export * from "./composable";
export { default as mergeOptions } from "./mergeOptions";
export { default as withContext } from "./withContext";
export { default as useServiceLogger } from "./useServiceLogger";

export const isDoneInvokeEvent = <T, E extends { type: string }>(
  event: E | DoneInvokeEvent<T>
): event is DoneInvokeEvent<T> => /^done.invoke/.test(event.type);
