import * as React from "react";

import { useObservableState } from "observable-hooks";

import PasswordInput, {
  PropsPassword
} from "../../../modules/components/input-controls/Password";

import createMachine, {
  EventType
} from "../../../modules/machines/input-control";

import {
  anonymousUser$,
  initialAnonymousUser
} from "../../../modules/streams/authentication";
import { useMachine } from "@xstate/react";
import { getter2 } from "../../../modules/fp";
import { pipe } from "fp-ts/lib/pipeable";
import * as R from "fp-ts/lib/Reader";
import { Interpreter } from "xstate";
import { BehaviorSubject } from "rxjs";

const machine = createMachine<string>({
  isValid: password => (password ? !!password.trim() : false)
});

type Event = React.FormEvent<HTMLInputElement>;

const identity = (event: Event) => event;

const getEventValue = R.map<Event, string>(getter2("currentTarget", "value"));

const streamPassword = (username: string) =>
  R.chain<Event, string, string>(password => () => {
    anonymousUser$.next({
      password,
      username
    });

    return password;
  });

const dispatchChangeEvent = (send: Interpreter<any, any, any, any>["send"]) =>
  R.map(value => {
    send({ type: EventType.Change, value });
  });

export const isValid$ = new BehaviorSubject(false)

const Password = (
  props: Omit<PropsPassword, "value" | "onChange" | "onFocus" | "onBlur" | "invalid" | "focused">
) => {
  const [state, send] = useMachine(machine);

  const { password, username } = useObservableState(
    anonymousUser$,
    initialAnonymousUser
  );

  const onChange = pipe(
    identity,
    getEventValue,
    streamPassword(username),
    dispatchChangeEvent(send),
    R.chain(_ => () => isValid$.next(state.matches('valid.valid')))
  );

  return (
    <PasswordInput
      {...props}
      value={password}
      invalid={state.matches('touched.touched') && state.matches("valid.invalid")}
      focused={state.matches("focused.focused")}
      onChange={onChange}
      onFocus={() => send({ type: EventType.Focus })}
      onBlur={() => send({ type: EventType.Blur })}
    />
  );
};

export default Password;
