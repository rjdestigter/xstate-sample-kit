import { createMachine as createXStateMachine } from "xstate";

import { StateType, EventType, Event } from "./types";

/**
 * Raw configuration for input control state machines
 */
export const configuration = {
  initial: StateType.InProgress,
  on: {
    [EventType.Reset]: {
      target: StateType.InProgress
    }
  },
  states: {
    [StateType.InProgress]: {
      on: {
        [EventType.Submit]: {
          target: StateType.Submitting
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

export const services = {
  submitOperation: (_: any, evt: Event<any, any>) =>
    evt.type === EventType.Submit
      ? evt.promiser()
      : Promise.reject("submitService invoked by non-submit event!")
};

export const createMachine = <L, R>() =>
  createXStateMachine<any, Event<L, R>>(configuration, {
    services: services as any
  });
