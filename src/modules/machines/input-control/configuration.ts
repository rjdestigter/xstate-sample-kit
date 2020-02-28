import { createMachine as createXStateMachine, Interpreter, MachineConfig } from "xstate";

import {
  StateType,
  EventType,
  Event,
  ChangeEvent,
  FocusEvent,
  BlurEvent,
  ResetEvent
} from "./types";
import { flow, identity } from "fp-ts/lib/function";

/**
 * Raw configuration for input control state machines
 */
export const configuration: MachineConfig<any, any, Event<any>> = {
  type: "parallel" as "parallel",
  states: {
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
          // @ts-ignore
          "": {
            target: StateType.Valid,
            cond: "isValid"
          },
          on: {
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

export const createMachine = <T>({
  isValid = () => true,
  withConfig
}: {
  isValid?: (value?: T) => boolean;
  withConfig?: (config: MachineConfig<any, any, Event<T>>) => MachineConfig<any, any, Event<T>>
} = {}) => {
  const machineConfiguration = withConfig ? withConfig(configuration) : configuration;
  
  return createXStateMachine<any, Event<T>>(machineConfiguration, {
    guards: {
      isHuman: (_, e) => (isChangeEvent(e) ? !e.isRobot : false),
      isValid: (_: any, e: Event<T>) =>
        isChangeEvent(e) ? isValid(e.value) : true,
      isNotValid: (_: any, e: Event<T>) =>
        isChangeEvent(e) ? !isValid(e.value) : false
    }
  });
}

export const reset = (): ResetEvent => ({ type: EventType.Reset });
export const focus = (): FocusEvent => ({ type: EventType.Focus });
export const blur = (): BlurEvent => ({ type: EventType.Blur });
export const change = <T>(value: T, isRobot = false): ChangeEvent<T> => ({
  type: EventType.Change,
  value,
  isRobot
});

export const makeEvenDispatchers = <T>(
  send: Interpreter<any, any, Event<T>>["send"]
) => {
  const dispatchFocus = () => send(focus());
  const dispatchBlur = () => send(blur());
  const dispatchChange = (value: T) => send(change(value));
};
