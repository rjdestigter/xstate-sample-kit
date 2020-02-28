import { Either } from "fp-ts/lib/Either";

import {
  MachineOptions as XStateMachineOptions,
  MachineConfig as XStateMachineConfig,
  StateSchema as XStateStateSchema,
  State as XState,
  DoneInvokeEvent,
  ErrorPlatformEvent
} from "xstate";

export const StateTypeInProgress = "inProgress" as const;
export const StateTypeValid = "Valid" as const;
export const StateTypeInValid = "InValid" as const;
export const StateTypeSubmitting = "submitting" as const;
export const StateTypeDone = "done" as const;

export const StateType = {
  InProgress: StateTypeInProgress,
  Submitting: StateTypeSubmitting,
  Done: StateTypeDone,
  Valid: StateTypeValid,
  InValid: StateTypeInValid
};

export const EventTypeSubmit: "SUBMIT" = "SUBMIT";
export const EventTypeReset: "RESET" = "RESET";
export const EventTypeValid: "VALID" = "VALID";
export const EventTypeInValid: "INVALID" = "INVALID";

/**
 * Dictionary of input control state event types.
 */
export const EventType = {
  Submit: EventTypeSubmit,
  Reset: EventTypeReset,
  Valid: EventTypeValid,
  InValid: EventTypeInValid
};

/**
 * Events dispatched for the input control state machine.
 */
export type Event<L, R> =
  | { type: typeof EventType.Submit; promiser: () => Promise<Either<L, R>> }
  | { type: typeof EventType.Reset }
  | { type: typeof EventType.Valid, }
  | { type: typeof EventType.InValid, }
  | DoneInvokeEvent<Either<L, R>>
  | ErrorPlatformEvent;

/**
 * Possible states for the input control machine.
 *
 * @typeparam T See [[Context.value]]
 */
export type TypeState =
  | { context: any, value: { [StateType.Valid]: {}; [StateType.InValid]: {} } }
  | { context: any, value: typeof StateType.Submitting }
  | { context: any, value: typeof StateType.Done };

export interface StateSchema extends XStateStateSchema {
  context: {};
  states: {
    [StateType.InProgress]: {
      states: {
        [StateType.Valid]: {},
        [StateType.InValid]: {}
      }
    };
    [StateType.Submitting]: {};
    [StateType.Done]: {};
  };
}

export type MachineOptions<L, R> = Partial<
  XStateMachineOptions<any, Event<L, R>>
>;

export type MachineConfig<L, R> = XStateMachineConfig<
  any,
  StateSchema,
  Event<L, R>
>;

export type State<L, R> = XState<any, Event<L, R>, StateSchema, TypeState>
