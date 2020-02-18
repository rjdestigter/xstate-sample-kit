import * as React from "react";
import { State, EventObject } from "xstate";

import {
  Context as InputControlContext,
  Event as InputControlEvent
} from "../../../modules/machines/input-control";

import Username from "../../../modules/components/input-controls/Username";

import FromInputControlMachine, {
  ProvidedInputProps
} from "../../../modules/components/input-controls/FromMachine";


import { api } from "../../../modules/machines/username";


const usernameRenderProp = <T, E extends EventObject>(current: State<T, E>) => (
  props: ProvidedInputProps
) => (
  <Username
    {...props}
    disabled={current.matches("status.submitting")}
    focused={current.matches("username.focused.focused")}
    invalid={
      current.matches("username.touched.touched") &&
      current.matches("username.valid.invalid")
    }
  />
);

export type PropsUsernameInput<
  TContext extends InputControlContext<string, "username">,
  TEvent extends EventObject,
  TState extends State<TContext, any, any, any>
> = {
  send: (evt: InputControlEvent<string>) => void;
  context: TContext;
  current: TState;
};

const UsernameInput = <
  TContext extends InputControlContext<string, "username">,
  TEvent extends EventObject,
  TState extends State<TContext, any, any, any>
>(
  props: PropsUsernameInput<TContext, TEvent, TState>
) => (
  <FromInputControlMachine
    send={props.send}
    context={props.current.context}
    api={api}
  >
    {usernameRenderProp(props.current)}
  </FromInputControlMachine>
);

export default UsernameInput