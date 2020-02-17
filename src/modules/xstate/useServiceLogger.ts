import { useEffect } from "react";
import { Interpreter, StateSchema, EventObject, Typestate } from "xstate";

/**
 *
 */
export default <
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
  }, [service]);
