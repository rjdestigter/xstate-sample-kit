// Libs
import React from "react";
import { useMachine } from "@xstate/react";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { constant } from "fp-ts/lib/function";

// Components
import Content from "../../../modules/components/Content/Content";
import WelcomeMessage from "../../../modules/components/WelcomeMessage";
import ResetButton from "./ResetButton";
import FailureMessage from "./FailureMessage";
import LoginForm from "./LoginForm";

// Modules
import { fetchUser } from "../../../modules/apis/login-api";
import { useServiceLogger } from "../../../modules/xstate";
import { foldString } from "../../../modules/fp";
// import { machine as loginMachine, api } from "../../../modules/machines/login";

import configuration, {
  createMachine, EventType
} from "../../../modules/machines/operator";

// Text
import text from "./text.json";
import { User } from "../../../modules/models/users";
import { Failure } from "../../../modules/apis/q";

import { isValid$ as usernameIsValid$ } from "./UsernameInput";
import { isValid$ as passwordIsValid$ } from "./PasswordInput";
import { merge, map, startWith } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { useObservableState } from "observable-hooks";

import { loginOperation$, anonymousUser$ } from '../../../modules/streams/authentication'

const isValid$ = combineLatest(usernameIsValid$, passwordIsValid$).pipe(
  map(([a, b]) => a && b),
);

const machine = createMachine<Failure, User>();

// Exports
const LoginApp = () => {
  // Hooks
  const [operatorState, send, service] = useMachine(machine);
  const isValid = useObservableState(isValid$, false)
  const loginOperation = useObservableState(loginOperation$, O.none)
 
  useServiceLogger(service, "login");

  // Derived information
  const isInProgress = operatorState.matches("inProgress");
  const isNotInProgress = !isInProgress;
  const isSubmitting = operatorState.matches("submitting");

  const canNotSubmit =
    isNotInProgress || !isValid

  const loggedIn = pipe(
    loginOperation,
    O.fold(constant(false), either =>
      pipe(either, E.fold(constant(false), constant(true)))
    )
  );

  const resetText = isInProgress
    ? text["Reset"]
    : isSubmitting
    ? text["Cancel"]
    : loggedIn
    ? text["Logout"]
    : text["Try again"];

  const reset = () => {
    send({ type: EventType.Reset})
    anonymousUser$.next({ username: "", password: ""})
    loginOperation$.next(O.none)
  }

  const resetButton = <ResetButton onClick={reset}>{resetText}</ResetButton>;

  const form = (
    <LoginForm
      isSubmitting={isSubmitting}
      canNotSubmit={canNotSubmit}
      onLogin={() => {
        send({
          type: EventType.Submit,
          promiser: async () => {
            const response = await fetchUser(anonymousUser$.getValue())

            loginOperation$.next(O.some(response))

            return response
          }
        });
      }}
      resetButton={resetButton}
    />
  );

  const content = pipe(
    loginOperation,
    O.fold(constant(form), either =>
      pipe(
        either,
        E.fold(
          failure => (
            <>
              <FailureMessage failure={failure} />
              {resetButton}
            </>
          ),

          user => {
            return (
              <>
                <WelcomeMessage user={user} />
                {resetButton}
              </>
            );
          }
        )
      )
    )
  );

  return <Content loading={isSubmitting}>{content}</Content>;
};

export default LoginApp;
