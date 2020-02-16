import "./App.css";

import React from "react";

import { useMachine } from "@xstate/react";
import { State, EventObject } from "xstate";
import {
  configure as configureInputControl,
  Context as InputControlContext,
  Event as InputControlEvent,
  Api as InputControlApi
} from "./modules/machines/input-control";

import Button from "./modules/components/input-controls/Button";
import Password from "./modules/components/input-controls/Password/Password";
import Username from "./modules/components/input-controls/Username/Username";
import { Typography } from "@rmwc/typography";

import FromInputControlMachine, {
  ProvidedInputProps
} from "./modules/components/input-controls/FromMachine";

import * as Operator from "./modules/machines/operator";

import { fetchUser, User } from "./modules/apis/auth";

import { createMachine as createStateMachine } from "xstate";
import { Option, fold as foldOption } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { constant } from "fp-ts/lib/function";
import { fold as foldEither } from "fp-ts/lib/Either";

import { combine, useServiceLogger } from "./modules/xstate";

import { getter } from "./modules/fp";
import { Errors } from "io-ts";

const usernameConfig = configureInputControl({
  id: "username",
  // initialValue: "This is not placeholder text",
  isValid: (ms: Option<string>) =>
    pipe(
      ms,
      foldOption(constant(false), str => !!str.trim())
    )
});

const passwordConfig = configureInputControl({
  id: "password",
  isValid: (ms: Option<string>) =>
    pipe(
      ms,
      foldOption(constant(false), str => !!str.trim())
    )
});

const operationConfig = Operator.configure<Errors | Error, User, "status">({
  id: "status"
}); //, canSubmit: () => true})

export const loginConfig = combine("login")(
  usernameConfig,
  passwordConfig,
  operationConfig
);

export const loginMachine = createStateMachine(
  loginConfig.config,
  loginConfig.options
);

const usernameRenderProp = <T, E extends EventObject>(current: State<T, E>) => (
  props: ProvidedInputProps
) => (
  <Username
    {...props}
    disabled={current.matches("status.submitting")}
    invalid={
      current.matches("username.touched.touched") &&
      current.matches("username.valid.invalid")
    }
  />
);

const passwordRenderProp = <T, E extends EventObject>(current: State<T, E>) => (
  props: ProvidedInputProps
) => (
  <Password
    {...props}
    disabled={current.matches("status.submitting")}
    invalid={
      current.matches("password.touched.touched") &&
      current.matches("password.valid.invalid")
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
    api={usernameConfig.api}
  >
    {usernameRenderProp(props.current)}
  </FromInputControlMachine>
);

const Form = () => {
  const [current, send, service] = useMachine(loginMachine);

  useServiceLogger(service, "login");

  const isNotInProgress = !current.matches("status.inProgress");
  const usernameIsInvalid = current.matches("password.valid.invalid");
  const passwordIsInvalid = current.matches("password.valid.invalid");
  const canNotSubmit =
    isNotInProgress || usernameIsInvalid || passwordIsInvalid;

  const form = (
    <form>
      <Typography use={"headline3"}>{"[title of show]"}</Typography>
      <br />
      <br />
      <UsernameInput send={send} current={current} context={current.context} />
      <br />
      <FromInputControlMachine
        send={send}
        context={current.context}
        api={passwordConfig.api}
      >
        {passwordRenderProp(current)}
      </FromInputControlMachine>
      <br />
      <Button
        raised
        disabled={canNotSubmit}
        onClick={() => {
          send(
            loginConfig.api.status.eventCreators.submit(() =>
              fetchUser({ username: "foobar", password: "Hello?" })
            )
          );
        }}
      >
        {current.matches("status.inProgress") ? "Login" : "...authenticating"}
      </Button>
    </form>
  );

  return pipe(
    loginConfig.api.status.selector(current.context),
    foldOption(constant(form), either =>
      pipe(
        either,
        foldEither(
          constant(<div className="fail">Something went terribly wrong!</div>),
          user => {
            return <div id="welcome">Welcome {getter("username")(user)}</div>;
          }
        )
      )
    )
  );
};

const App: React.FC = () => {
  return (
    <div className="App">
      <React.StrictMode>
        <Form />
      </React.StrictMode>
    </div>
  );
};

export default App;
