import { createMachine as createXStateMachine } from "xstate";

import { StateType, EventType, Event, ChangeEvent } from "./types";

/**
 * Raw configuration for input control state machines
 */
export const configuration = {
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
  isValid = () => true
}: {
  isValid?: (value?: T) => boolean;
} = {}) =>
  createXStateMachine<any, Event<T>>(configuration, {
    guards: {
      isHuman: (_, e) => (isChangeEvent(e) ? !e.isRobot : false),
      isValid: (_: any, e: Event<T>) =>
        isChangeEvent(e) ? isValid(e.value) : true,
      isNotValid: (_: any, e: Event<T>) =>
        isChangeEvent(e) ? !isValid(e.value) : false
    }
  });
