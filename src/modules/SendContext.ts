import { Interpreter } from 'xstate'
import { createContext } from 'react'
import { Option, none } from 'fp-ts/es6/Option'

export type Send = Option<Interpreter<any, any, any, any>['send']>

const SendContext = createContext<Send>(none);

export const { Provider, Consumer } = SendContext