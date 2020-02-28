/**
 * @packageDocumentation
 * @module xstate
 */

 import { useEffect } from "react";
import { Interpreter, StateSchema, EventObject, Typestate } from "xstate";

/**
 * ```hs
 * useServiceLogger :: Interpreter ctx schema event typeState ->  string -> void
 * ```
 * 
 * React hook for logging interpreted state machines.
 * 
 * @typeparam TContext The state machine's context state type
 * @typeparam TStateSchema Schema type, defaults to `any`
 * @typeparam TEvent The types of events that the machine dispatches, defaults to `any`
 * @typeparam TTypeState The typed contextual state of a machine, defaults to `any`
 * @param service The interpreted state machine's service
 * @param name A name used to label the logged group.
 */
export const useServiceLogger = <
  TContext,
  TStateSchema extends StateSchema = any,
  TEvent extends EventObject = EventObject,
  TTypestate extends Typestate<TContext> = any
>(
  service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>,
  name?: string
) =>
  useEffect(() => {
    let i = 0;

    const subscription = service.subscribe(nextState => {
      if (name) {
        console.groupCollapsed(`${name} (${++i})`);
      }

      console.log(JSON.stringify(nextState.value, null, 2))
      console.log(JSON.stringify(nextState.context, null, 2))
      console.log(nextState);

      if (name) {
        console.groupEnd();
      }

      return () => {
        subscription.unsubscribe();
      };
    });
  }, [service, name]);

  export default useServiceLogger