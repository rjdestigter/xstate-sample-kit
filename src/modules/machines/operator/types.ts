import { Either } from "fp-ts/lib/Either";

import {
  MachineOptions as XStateMachineOptions,
  MachineConfig as XStateMachineConfig,
  StateSchema as XStateStateSchema,
  DoneInvokeEvent,
  ErrorPlatformEvent
} from "xstate";

export const StateTypeInProgress = "inProgress" as const;
export const StateTypeSubmitting = "submitting" as const;
export const StateTypeDone = "done" as const;

export const StateType = {
  InProgress: StateTypeInProgress,
  Submitting: StateTypeSubmitting,
  Done: StateTypeDone,
};

export const EventTypeSubmit: "SUBMIT" = "SUBMIT";
export const EventTypeReset: "RESET" = "RESET";

/**
 * Dictionary of input control state event types.
 */
export const EventType = {
  Submit: EventTypeSubmit,
  Reset: EventTypeReset,
};

/**
 * Events dispatched for the input control state machine.
 */
export type Event<L, R> =
  | { type: typeof EventType.Submit, promiser: () => Promise<Either<L, R>> }
  | { type: typeof EventType.Reset }
  // | DoneInvokeEvent<Either<L, R>>
  // | ErrorPlatformEvent

/**
 * Possible states for the input control machine.
 *
 * @typeparam T See [[Context.value]]
 */
export type State = 
  | { value: typeof StateType.InProgress  }
  | { value: typeof StateType.Submitting  }
  | { value: typeof StateType.Done  }

export interface StateSchema extends XStateStateSchema {
  context: {},
  states: {
    [StateType.InProgress]: {},
    [StateType.Submitting]: {},
    [StateType.Done]: {}
  }
}

export type MachineOptions<L, R> = Partial<
  XStateMachineOptions<any, Event<L, R>>
>;

export type MachineConfig<L, R> = XStateMachineConfig<
  any,
  StateSchema,
  Event<L, R>
>;
