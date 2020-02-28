import { createMachine as createXStateMachine, MachineConfig } from "xstate";

import { StateType, EventType, Event } from "./types";

/**
 * Raw configuration for input control state machines
 */
export const configuration = {
  id: 'operator',
  initial: StateType.InProgress,
  on: {
    [EventType.Reset]: {
      target: StateType.InProgress
    }
  },
  states: {
    [StateType.InProgress]: {
      initial: StateType.InValid,
      states: {
        [StateType.Valid]: {
          on: {
            [EventType.InValid]: StateType.InValid,
            [EventType.Submit]: {
              target: `#operator.${StateType.Submitting}`
            }
          }
        },
        [StateType.InValid]: {
          on: {
            [EventType.Valid]: StateType.Valid
          }
        }
      }
    },
    [StateType.Submitting]: {
      invoke: {
        id: "submitOperation",
        src: "submitOperation",
        onDone: StateType.Done,
        onError: StateType.Done
      }
    },
    [StateType.Done]: {}
  }
};

const isEvent = <E extends Event<any, any>["type"]>(eventType: E) => <L, R>(
  event: Event<L, R>
): event is Extract<Event<L, R>, { type: E }> => event.type === eventType;

export const isSubmitEvent = isEvent(EventType.Submit);

export const services = {
  submitOperation: (_: any, evt: Event<any, any>) =>
    isSubmitEvent(evt)
      ? evt.promiser()
      : Promise.reject("submitService invoked by non-submit event!")
};

export const createMachine = <L, R>(
  withConfig?: (c: typeof configuration) => MachineConfig<any, any, Event<L, R>>
) =>
  createXStateMachine<any, Event<L, R>>(
    withConfig ? withConfig(configuration) : configuration,
    {
      services: services as any
    }
  );
