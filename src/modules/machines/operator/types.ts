import { Option } from "fp-ts/lib/Option";
import { Either } from "fp-ts/lib/Either";

import {
  MachineOptions as XStateMachineOptions,
  MachineConfig as XStateMachineConfig,
  DoneInvokeEvent
} from "xstate";

import { ComposableMachineConfig } from "../../xstate";

export const StateTypeInProgress = "inProgress" as const;
export const StateTypeSubmitting = "submitting" as const;
export const StateTypeSucceeded = "succeeded" as const;
export const StateTypeFailed = "failed" as const;

export const StateType = {
  InProgress: StateTypeInProgress,
  Submitting: StateTypeSubmitting,
  Succeeded: StateTypeSucceeded,
  Failed: StateTypeFailed,
};

export const EventTypeSubmit: "SUBMIT" = "SUBMIT";
export const EventTypeSucceed: "SUCCEED" = "SUCCEED";
export const EventTypeFail: "FAIL" = "FAIL";

/**
 * Dictionary of input control state event types.
 */
export const EventType = {
  Submit: EventTypeSubmit,
  Succeed: EventTypeSucceed,
  Fail: EventTypeFail,
};

/**
 * Events dispatched for the input control state machine.
 */
export type Event<L, R> =
  | { type: typeof EventType.Submit, promiser: () => Promise<Either<L, R>> }
  | { type: typeof EventType.Succeed }
  | { type: typeof EventType.Fail, error?: L | undefined }
  | DoneInvokeEvent<Either<L, R>>
/**
 * Possible states for the input control machine.
 *
 * @typeparam T See [[Context.value]]
 */
export type State<L, R, I extends string> = 
  | { value: typeof StateType.InProgress, context: Context<L, R, I>  }
  | { value: typeof StateType.Submitting, context: Context<L, R, I>  }
  | { value: typeof StateType.Succeeded, context: Context<L, R, I>  }
  | { value: typeof StateType.Failed, context: Context<L, R, I>  }

/**
 * Context state for input-control machines.
 *
 * @typeparam T Type of the data the input control outputs. Defaults to `string`
 */
export type Context<L, R, I extends string> = {
  [P in I]: Option<Either<L, R>>;
};

export interface Api<L, R, I extends string> {
  eventCreators: {
    submit: (promiser: () => Promise<Either<L, R>>) => Extract<Event<L, R>, { type: typeof EventType.Submit }>
    succeed: () => Extract<Event<L, R>, { type: typeof EventType.Succeed }>
    fail: (error?: L) => Extract<Event<L, R>, { type: typeof EventType.Fail }>;
  };
  selector: (context: Context<L, R, I>) => Context<L, R, I>[I]
}

export type MachineOptions<L, R, I extends string> = Partial<
  XStateMachineOptions<Context<L, R, I>, Event<L, R>>
>;

export type MachineConfig<L, R, I extends string> = XStateMachineConfig<
  Context<L, R, I>,
  any,
  Event<L, R>
>;

export type Config<L, R, I extends string> = ComposableMachineConfig<
  Api<L, R, I>,
  Context<L, R, I>,
  any,
  Event<L, R>,
  I
>;
