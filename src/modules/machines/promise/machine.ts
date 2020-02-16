import { createMachine, assign } from 'xstate';

export interface PromiseContext<T> {
  output?: T
  error?: string;
}

enum PromiseEventTypes {
  Request = "REQUEST",
}

type PromiseEvent<T> =
  | { type: PromiseEventTypes.Request }

type PromiseState<T> = 
  | { value: 'idle', context: PromiseContext<T> & { output: undefined, error: undefined,  }}
  | { value: 'pending', context: PromiseContext<T> & { output: undefined, error: undefined }}
  | { value: 'resolved', context: PromiseContext<T> & { output: T, error: undefined }}
  | { value: 'rejected', context: PromiseContext<T> & { output: undefined, error: string }}

export const fromPromise = <T>(f: () => Promise<T>) => {
  return createMachine<PromiseContext<T>, PromiseEvent<T>, PromiseState<T>>({
    id: 'promise',
    initial: 'idle',
    context: {
    },
    states: {
      idle: {
        on: {
          [PromiseEventTypes.Request]: 'pending'
        }
      },
      pending: {
        invoke: {
          src: () => f(),

          onDone: {
            actions: [assign({ output: (_, e) => e.data})],
            target: 'resolved'
          },
          onError: {
            actions: [assign({ error: (_, e) => e.data})]
            ,target: 'rejected'
          }
        },
      },
      resolved: {
        type: 'final'
      },
      rejected: {
        type: 'final'
      }
    }
  })
}

export default fromPromise

