/**
 * @packageDocumentation
 * @module machines/input-control
 * 
 */
import {
  createMachine as createXStateMachine,
  MachineConfig,
  State,
  assign
} from "xstate";

import {
  StateType,
  EventType,
  Event,
  ChangeEvent,
  FocusEvent,
  BlurEvent,
  ResetEvent,
  Context,
  StateSchema,
  TypeState
} from "./types";

/**
 * Raw configuration for input control state machines
 */
export const configuration: MachineConfig<any, any, Event<any>> = {
  type: "parallel" as "parallel",
  context: {},
  states: {
    [StateType.Edit]: {
      on: {
        [EventType.Change]: {
          actions: "assignValue"
        }
      }
    },
    [StateType.Pristine]: {
      initial: StateType.Pristine,
      states: {
        [StateType.Pristine]: {
          on: {
            [EventType.Change]: {
              target: StateType.Dirty,
              cond: "isHuman"
            }
          }
        },
        [StateType.Dirty]: {
          on: {
            [EventType.Reset]: StateType.Pristine
          }
        }
      }
    },
    [StateType.Touched]: {
      initial: StateType.Untouched,
      states: {
        [StateType.Untouched]: {
          on: {
            [EventType.Focus]: {
              target: StateType.Touching
            }
          }
        },
        [StateType.Touching]: {
          on: {
            // [EventType.Reset]: StateType.Untouched,
            [EventType.Blur]: {
              target: StateType.Touched
            }
          }
        },
        [StateType.Touched]: {
          on: {
            [EventType.Reset]: StateType.Untouched
          }
        }
      }
    },
    [StateType.Valid]: {
      initial: StateType.Invalid,
      states: {
        [StateType.Invalid]: {
          on: {
            "": {
              target: StateType.Valid,
              cond: "isValid"
            },
            [EventType.Change]: {
              target: StateType.Valid,
              cond: "isValid"
            }
          }
        },
        [StateType.Valid]: {
          on: {
            [EventType.Change]: {
              target: StateType.Invalid,
              cond: "isNotValid"
            },
            [EventType.Reset]: StateType.Invalid
          }
        }
      }
    },
    [StateType.Focused]: {
      initial: StateType.Blurred,
      states: {
        [StateType.Focused]: {
          on: {
            [EventType.Blur]: StateType.Blurred
          }
        },
        [StateType.Blurred]: {
          on: {
            [EventType.Focus]: StateType.Focused
          }
        }
      }
    }
  }
};

const isChangeEvent = <T>(event: Event<T>): event is ChangeEvent<T> =>
  event.type === EventType.Change;

/**
 *
 * @param param0
 */
export const createMachine = <T>({
  isValid = () => true,
  withConfig
}: {
  isValid?: (value?: T) => boolean;
  withConfig?: (
    config: MachineConfig<Context<T>, StateSchema<T>, Event<T>>
  ) => MachineConfig<Context<T>, StateSchema<T>, Event<T>>;
} = {}) => {
  const machineConfiguration = withConfig
    ? withConfig(configuration)
    : configuration;

  return createXStateMachine<Context<T>, Event<T>, TypeState<T>>(
    machineConfiguration,
    {
      actions: {
        assignValue: assign<Context<T>, Event<T>>({
          value: (ctx, e) => (isChangeEvent(e) ? e.value : ctx.value)
        })
      },
      guards: {
        isHuman: (_, e) => (isChangeEvent(e) ? !e.isRobot : false),
        isValid: (ctx: Context<T>, e: Event<T>) => isValid(isChangeEvent(e) ? e.value : ctx.value),
        isNotValid: (ctx: Context<T>, e: Event<T>) =>
          !isValid(isChangeEvent(e) ? e.value : ctx.value)
      }
    }
  );
};

export const reset = (): ResetEvent => ({ type: EventType.Reset });
export const focus = (): FocusEvent => ({ type: EventType.Focus });
export const blur = (): BlurEvent => ({ type: EventType.Blur });
export const change = <T>(value: T, isRobot = false): ChangeEvent<T> => ({
  type: EventType.Change,
  value,
  isRobot
});
