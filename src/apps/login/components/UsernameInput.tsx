import * as React from "react";

import { useObservableState } from "observable-hooks";

import UsernameInput, {
  PropsUsername
} from "../../../modules/components/input-controls/Username";

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
  isValid: username => (username ? !!username.trim() : false)
});

type Event = React.FormEvent<HTMLInputElement>;

const identity = (event: Event) => event;

const getEventValue = R.map<Event, string>(getter2("currentTarget", "value"));

const streamUsername = (password: string) =>
  R.chain<Event, string, string>(username => () => {
    anonymousUser$.next({
      username,
      password
    });

    return username;
  });

const dispatchChangeEvent = (send: Interpreter<any, any, any, any>["send"]) =>
  R.map(value => {
    send({ type: EventType.Change, value });
  });

export const isValid$ = new BehaviorSubject(false)

const Username = (
  props: Omit<PropsUsername, "value" | "onChange" | "onFocus" | "onBlur" | "invalid" | "focused">
) => {
  const [state, send] = useMachine(machine);
  
  const { username, password } = useObservableState(
    anonymousUser$,
    initialAnonymousUser
  );

  const onChange = pipe(
    identity,
    getEventValue,
    streamUsername(password),
    dispatchChangeEvent(send),
    R.chain(_ => () => isValid$.next(state.matches('valid.valid')))
  );

  return (
    <UsernameInput
      {...props}
      value={username}
      invalid={state.matches('touched.touched') && state.matches("valid.invalid")}
      focused={state.matches("focused.focused")}
      onChange={onChange}
      onFocus={() => send({ type: EventType.Focus })}
      onBlur={() => send({ type: EventType.Blur })}
    />
  );
};

export default Username;
