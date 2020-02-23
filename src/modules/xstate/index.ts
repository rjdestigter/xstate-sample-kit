import { DoneInvokeEvent, ErrorPlatformEvent } from "xstate";

export { default as withContext } from "./withContext";
export { default as useServiceLogger } from "./useServiceLogger";

export const isDoneInvokeEvent = <T, E extends { type: string }>(
  event: E | DoneInvokeEvent<T>
): event is DoneInvokeEvent<T> => /^done.invoke/.test(event.type);

export const isErrorPlatformEvent = <T, E extends { type: string }>(
  event: E | ErrorPlatformEvent
): event is ErrorPlatformEvent => /^error.platform/.test(event.type);
