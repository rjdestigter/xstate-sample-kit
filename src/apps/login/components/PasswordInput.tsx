import * as React from "react";
import { State, EventObject } from "xstate";

import {
  Context as InputControlContext,
  Event as InputControlEvent
} from "../../../modules/machines/input-control";

import Password from "../../../modules/components/input-controls/Password";

import { api } from '../../../modules/machines/password'

import FromInputControlMachine, {
  ProvidedInputProps
} from "../../../modules/components/input-controls/FromMachine";


const passwordRenderProp = <T, E extends EventObject>(current: State<T, E>) => (
  props: ProvidedInputProps
) => (
  <Password
    {...props}
    focused={current.matches('password.focused.focused')}
    disabled={current.matches("status.submitting")}
    invalid={
      current.matches("password.touched.touched") &&
      current.matches("password.valid.invalid")
    }
  />
);

export type PropsPasswordInput<
  TContext extends InputControlContext<string, "password">,
  TEvent extends EventObject,
  TState extends State<TContext, any, any, any>
> = {
  send: (evt: InputControlEvent<string>) => void;
  context: TContext;
  current: TState;
};

const PasswordInput = <
  TContext extends InputControlContext<string, "password">,
  TEvent extends EventObject,
  TState extends State<TContext, any, any, any>
>(
  props: PropsPasswordInput<TContext, TEvent, TState>
) => (
  <FromInputControlMachine
    send={props.send}
    context={props.current.context}
    api={api}
  >
    {passwordRenderProp(props.current)}
  </FromInputControlMachine>
);

export default PasswordInput