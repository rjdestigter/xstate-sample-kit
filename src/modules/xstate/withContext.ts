import { EventObject, AnyEventObject, Typestate, StateMachine } from "xstate";

const withContext = <
  TContext,
  TEvent extends EventObject = AnyEventObject,
  TTypestate extends Typestate<TContext> = any
>(
  machine: StateMachine<TContext, any, TEvent, TTypestate>
) => (context: TContext): typeof machine => machine.withContext(context) as any;

export default withContext