import { Option } from "fp-ts/lib/Option";

import {
  MachineOptions as XStateMachineOptions,
  MachineConfig as XStateMachineConfig,
  StateSchema as XStateStateSchema
} from "xstate";

import { ComposableMachineConfig } from "../../xstate";

export const StateTypeEdit = "edit" as const;
export const StateTypePristine = "pristine" as const;
export const StateTypeDirty = "dirty" as const;
export const StateTypeTouched = "touched" as const;
export const StateTypeTouching = "touching" as const;
export const StateTypeUntouched = "untouched" as const;
export const StateTypeFocused = "focused" as const;
export const StateTypeBlurred = "blurred" as const;
export const StateTypeValid = "valid" as const;
export const StateTypeInvalid = "invalid" as const;

export const StateType = {
  Edit: StateTypeEdit,
  Pristine: StateTypePristine,
  Dirty: StateTypeDirty,
  Touched: StateTypeTouched,
  Touching: StateTypeTouching,
  Untouched: StateTypeUntouched,
  Focused: StateTypeFocused,
  Blurred: StateTypeBlurred,
  Valid: StateTypeValid,
  Invalid: StateTypeInvalid
};

export const EventTypeChange: "CHANGE" = "CHANGE";
export const EventTypeFocus: "FOCUS" = "FOCUS";
export const EventTypeBlur: "BLUR" = "BLUR";
export const EventTypeReset: "RESET" = "RESET";

/**
 * Dictionary of input control state event types.
 */
export const EventType = {
  Change: EventTypeChange,
  Focus: EventTypeFocus,
  Blur: EventTypeBlur,
  Reset: EventTypeReset
};

/**
 * Events dispatched for the input control state machine.
 */
export type Event<T> =
  | {
      type: typeof EventType.Change;
      value?: T | null | undefined;
      isRobot?: boolean;
    }
  | { type: typeof EventType.Focus }
  | { type: typeof EventType.Blur }
  | { type: typeof EventType.Reset };

/**
 * Possible states for the input control machine.
 *
 * @typeparam T See [[Context.value]]
 */
export interface State<T, I extends string> {
  /** The input contorl state's context type */
  context: Context<T, I>;
  /** The input contorl state's value */
  value: {
    [StateType.Pristine]: typeof StateType.Dirty | typeof StateType.Pristine;
    [StateType.Touched]:
      | typeof StateType.Touched
      | typeof StateType.Touching
      | typeof StateType.Untouched;
    [StateType.Focused]: typeof StateType.Focused | typeof StateType.Blurred;
    [StateType.Valid]: typeof StateType.Valid | typeof StateType.Invalid;
  };
}

/**
 * Context state for input-control machines.
 *
 * @typeparam T Type of the data the input control outputs. Defaults to `string`
 */
export type Context<T, I extends string> = {
  [P in I]: Option<T>;
};

export interface StateSchema<T, I extends string> extends XStateStateSchema<Context<T, I>> {
  context: {};
  states: {
    [StateType.Edit]: {};
    [StateType.Pristine]: {
      states: {
        [StateType.Pristine]: {};
        [StateType.Dirty]: {};
      };
    };
    [StateType.Touched]: {
      states: {
        [StateType.Untouched]: {};
        [StateType.Touching]: {};
        [StateType.Touched]: {};
      };
    };
    [StateType.Valid]: {
      states: {
        [StateType.Invalid]: {};
        [StateType.Valid]: {};
      };
    };
    [StateType.Focused]: {
      states: {
        [StateType.Focused]: {};
        [StateType.Blurred]: {};
      };
    };
  };
}

export interface Api<T, I extends string> {
  eventCreators: {
    change: (value: T) => Event<T>;
    reset: () => Event<T>;
    focus: () => Event<T>;
    blur: () => Event<T>;
  };
  selector: (context: Context<T, I>) => Context<T, I>[I];
}

export type MachineOptions<T, I extends string> = Partial<
  XStateMachineOptions<Context<T, I>, Event<T>>
>;

export type MachineConfig<
  T,
  I extends string,
> = XStateMachineConfig<Context<T, I>, StateSchema<T, I>, Event<T>>;

export type Config<T, I extends string> = ComposableMachineConfig<
  Api<T, I>,
  Context<T, I>,
  StateSchema<T, I>,
  Event<T>,
  I
>;
