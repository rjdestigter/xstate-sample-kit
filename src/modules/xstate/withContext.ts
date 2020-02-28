/**
 * @packageDocumentation
 * @module xstate
 */

 import { EventObject, AnyEventObject, Typestate, StateMachine } from "xstate";

/**
 * Wrapper around XState's [[StateMachine['withContext']]]. The only reason
 * to use this version is to maintain type information as XState's version
 * causes you to loose some.
 * 
* @typeparam TContext The state machine's context state type
* @typeparam TStateSchema Schema type, defaults to `any`
* @typeparam TEvent The types of events that the machine dispatches, defaults to `any`
* @typeparam TTypeState The typed contextual state of a machine, defaults to `any`
* @param machine The state machine to add context to.
*/
const withContext = <
  TContext,
  TEvent extends EventObject = AnyEventObject,
  TTypestate extends Typestate<TContext> = any
>(
  machine: StateMachine<TContext, any, TEvent, TTypestate>
) => (context: TContext): typeof machine => machine.withContext(context) as any;

export default withContext