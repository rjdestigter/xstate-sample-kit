/**
 * @packageDocumentation
 * @module xstate
 * @preferred
 * 
 * Functions and utilities that compliment the XState library
 */

import { DoneInvokeEvent, ErrorPlatformEvent } from "xstate";

export { default as withContext } from "./withContext";

export { default as useServiceLogger } from "./useServiceLogger";

/**
 * Asserts that an event is of type [[DoneInvokeEvent]].
 * 
 * @typeparam TData The type of the DoneInvokeEvent's `.data` payload.
 * @typeparam TEvent The set of event types given event can be of
 * @param event The event object that is sent by or to the state machine.
 */
export const isDoneInvokeEvent = <TData, TEvent extends { type: string }>(
  event: TEvent | DoneInvokeEvent<TData>
): event is DoneInvokeEvent<TData> => /^done.invoke/.test(event.type);

/**
 * Asserts that an event is of type [[ErrorPlatformEvent]]
 * 
 * @typeparam TEvent The set of event types given event can be of
 * @param event The event object that is sent by or to the state machine.
 */
export const isErrorPlatformEvent = <TEvent extends { type: string }>(
  event: TEvent | ErrorPlatformEvent
): event is ErrorPlatformEvent => /^error.platform/.test(event.type);
