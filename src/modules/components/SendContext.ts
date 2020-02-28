import { Interpreter, State } from 'xstate'
import { createContext } from 'react'

export type StateMachineContext = { send: Interpreter<any, any, any, any>['send'], state: State<any, any> }

export const SendContext = createContext<StateMachineContext>({
  send: (() => {}) as any,
  state: {} as any
});

export const { Provider, Consumer } = SendContext