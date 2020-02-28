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
import { useServiceLogger, isDoneInvokeEvent } from "../../../modules/xstate";
import { foldString } from "../../../modules/fp";
// import { machine as loginMachine, api } from "../../../modules/machines/login";

import configuration, {
  createMachine, EventType, StateType
} from "../../../modules/machines/operator";

// Text
import text from "./text.json";
import { User } from "../../../modules/models/users";
import { Failure } from "../../../modules/apis/q";

// Streams
import { reset, reset$ } from '../../../modules/streams/reset'
import { isValid$ as usernameIsValid$ } from "./UsernameInput";
import { isValid$ as passwordIsValid$ } from "./PasswordInput";
import { map, mapTo } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { useObservableState } from "observable-hooks";

import { loginOperation$, getAnonymousUser } from '../../../modules/streams/authentication'
import { assign, spawn, State } from "xstate";

const isValid$ = combineLatest(usernameIsValid$, passwordIsValid$).pipe(
  map(([a, b]) => a && b),
);

const canReset$ = combineLatest(usernameIsValid$, passwordIsValid$).pipe(
  map(([a, b]) => a || b),
);

const machine = createMachine<Failure, User>(config => {
  return {
    ...config,
    states: {
      ...config.states,
      [StateType.Done]: {
        entry:  'assignDone'
      }
    },
    context: {
      reset$Ref: null
    },
    entry: assign({
      reset$Ref: () => spawn(reset$.pipe(mapTo({ type: EventType.Reset}))),
      isValid$Ref: () => spawn(isValid$.pipe(map(isValid => ({ type: isValid ? EventType.Valid : EventType.InValid}))))
    })
  }
}).withConfig({
  actions: {
    assignDone: (_, evt) => isDoneInvokeEvent(evt) && loginOperation$.next(O.some(evt.data))
  }
});

// Exports
const LoginApp = () => {
  // Hooks
  const [operatorState, send, service] = useMachine(machine);
  const isValid = useObservableState(isValid$, false)
  const canReset = useObservableState(canReset$, false)
  const loginOperation = useObservableState(loginOperation$, O.none)
 
  useServiceLogger(service, "login");

  // Derived information
  const isInProgress = operatorState.matches(StateType.InProgress);
  const isNotInProgress = !isInProgress;
  const isSubmitting = operatorState.matches(StateType.Submitting);

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

  const resetButton = <ResetButton disabled={!canReset} onClick={reset} takeFocus={operatorState.matches(StateType.Done)}>{resetText}</ResetButton>;

  const form = (
    <LoginForm
      isSubmitting={isSubmitting}
      canNotSubmit={canNotSubmit}
      onLogin={() => {
        send({
          type: EventType.Submit,
          promiser: async () => {
            const response = await fetchUser(getAnonymousUser())

            // loginOperation$.next(O.some(response))


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
