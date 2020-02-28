import * as React from "react";

import { assign, spawn } from "xstate";
import { useMachine } from "@xstate/react";
import { BehaviorSubject, merge } from "rxjs";
import { useObservableState } from "observable-hooks";
import { pipe } from "fp-ts/lib/pipeable";
import * as R from "fp-ts/lib/Reader";
import * as O from "fp-ts/lib/Option";

import PasswordInput, {
  PropsPassword
} from "../../../modules/components/input-controls/Password";

import createMachine, {
  State,
  change,
  reset,
  focus,
  blur
} from "../../../modules/machines/input-control";

import {
  password$,
  passwordValue$,
  setPassword,
  dotValue,
  isRobot,
} from "../../../modules/streams/authentication";

import { getEventCurrentTargetValue } from "../../../modules/utils/getters";
import { isTruthy } from "../../../modules/utils/assert";
import { InputEvent } from "../../../modules/types";
import { voidward } from "../../../modules/utils";
import { map, tap, filter, ignoreElements, mapTo, scan } from "rxjs/operators";
import { constant, identity, flow } from "fp-ts/lib/function";
import { reset$ } from "../../../modules/streams/reset";
import { useServiceLogger } from "../../../modules/xstate";
import { useSubject } from "../../../modules/hooks";

const machine = createMachine<string>({
  isValid: isTruthy,
  withConfig: config => {
    return {
      ...config,
      context: {
        reset$Ref: null
      },
      entry: assign({
        reset$Ref: () => spawn(reset$.pipe(mapTo(reset()))),
        change$Ref: () => spawn(password$.pipe(map(value => change(dotValue(value), isRobot(value)))))
      })
    };
  }
});

const inputEventIdentity = (event: InputEvent) => event;

const getEventValue = R.map<InputEvent, string>(getEventCurrentTargetValue);

const streamPassword = R.chain<InputEvent, string, string>(password => () =>
  setPassword(password)
);

export const state$ = new BehaviorSubject<O.Option<State<string>>>(O.none);

export const isValid$ = state$.pipe(
  map(maybeState =>
    pipe(
      maybeState,
      O.map(state => state.matches("valid.valid" as any)),
      O.fold(constant(false), identity)
    )
  )
);

const takeFocus$ = reset$.pipe(
  mapTo(2),
  scan(
    (acc, next) => acc + next
  )
)

const Password = (
  props: Omit<
    PropsPassword,
    "value" | "onChange" | "onFocus" | "onBlur" | "invalid" | "focused"
  >
) => {
  const [state, send, service] = useMachine(machine);

  useServiceLogger(service, "password");
  useSubject(state$, state);
  const password = useObservableState(passwordValue$, "");

  const onChange = pipe(
    inputEventIdentity,
    getEventValue,
    streamPassword
  );

  return (
    <PasswordInput
      {...props}
      value={password}
      invalid={
        state.matches("touched.touched") && state.matches("valid.invalid")
      }
      focused={state.matches("focused.focused")}
      onChange={onChange}
      onFocus={flow(focus, send)}
      onBlur={flow(blur, send)}
    />
  );
};

export default Password;
