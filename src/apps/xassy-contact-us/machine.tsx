/**
 * @packageDocumentation
 * @module app/xassy-contact-us
 * 
 */

import { assign, spawn } from "xstate";
import { mapTo, map } from "rxjs/operators";
import * as O from "fp-ts/lib/Option";

import {
  createMachine,
  EventType,
  StateType
} from "../../modules/machines/operator";
import { reset$ } from "../../modules/streams/reset";
import { isDoneInvokeEvent } from "../../modules/xstate";

import { contactUsResponse$, isValid$ } from "./streams";

export const machine = createMachine<false, true>(config => {
  return {
    ...config,
    states: {
      ...config.states,
      [StateType.Done]: {
        entry: "assignDone"
      }
    },
    entry: assign({
      reset$Ref: () => spawn(reset$.pipe(mapTo({ type: EventType.Reset }))),
      isValid$Ref: () =>
        spawn(
          isValid$.pipe(
            map(isValid => ({
              type: isValid ? EventType.Valid : EventType.InValid
            }))
          )
        )
    })
  };
}).withConfig({
  actions: {
    assignDone: (_, evt) =>
      isDoneInvokeEvent(evt) && contactUsResponse$.next(O.some(evt.data))
  }
});

export default machine;
