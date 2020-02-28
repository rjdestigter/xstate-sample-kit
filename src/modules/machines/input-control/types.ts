import {
  MachineOptions as XStateMachineOptions,
  MachineConfig as XStateMachineConfig,
  StateSchema as XStateStateSchema,
  State as XState,
  Typestate
} from "xstate";

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
      value?: T | undefined;
      isRobot?: boolean;
    }
  | { type: typeof EventType.Focus }
  | { type: typeof EventType.Blur }
  | { type: typeof EventType.Reset };


  export type ChangeEvent<T> = Extract<Event<T>, { type: typeof EventType.Change }>;
  export type FocusEvent= Extract<Event<any>, { type: typeof EventType.Focus }>;
  export type BlurEvent= Extract<Event<any>, { type: typeof EventType.Blur }>;
  export type ResetEvent= Extract<Event<any>, { type: typeof EventType.Reset }>;

/**
 * Possible states for the input control machine.
 *
 * @typeparam T See [[Context.value]]
 */
export interface TypeState<T> {
  /** The input contorl state's context type */
  context: any;
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

export interface StateSchema extends XStateStateSchema<any> {
  context: {};
  states: {
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

export interface EventCreators<E> {
  reset: () => E
}

export type MachineOptions<T> = Partial<
  XStateMachineOptions<any, Event<T>>
>;

export type MachineConfig<
  T,
> = XStateMachineConfig<any, StateSchema, Event<T>>;

export type State<T> = XState<any, Event<T>, StateSchema, TypeState<T>>