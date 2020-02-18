// Libs
import React from "react";
import { useMachine } from "@xstate/react";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { constant } from "fp-ts/lib/function";

// Components
import Content from "../../../modules/components/Content";
import WelcomeMessage from "../../../modules/components/WelcomeMessage";
import ResetButton from "./ResetButton";
import FailureMessage from "./FailureMessage";
import LoginForm from "./LoginForm";

// Modules
import { fetchUser } from "../../../modules/apis/login-api";
import { useServiceLogger } from "../../../modules/xstate";
import { foldString } from "../../../modules/fp";
import { machine as loginMachine, api } from "../../../modules/machines/login";

// Text
import text from "./text.json";

// Exports
const LoginApp = () => {
  const [current, send, service] = useMachine(loginMachine);

  useServiceLogger(service, "login");

  const isInProgress = current.matches("status.inProgress");
  const isNotInProgress = !isInProgress;
  const usernameIsInvalid = current.matches("password.valid.invalid");
  const passwordIsInvalid = current.matches("password.valid.invalid");
  const isSubmitting = current.matches("status.submitting");

  const canNotSubmit =
    isNotInProgress || usernameIsInvalid || passwordIsInvalid;

  const loggedIn = pipe(
    api.status.selector(current.context),
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

  const resetButton = <ResetButton send={send}>{resetText}</ResetButton>;

  const form = (
    <LoginForm
      send={send}
      current={current}
      isInProgress={isInProgress}
      isNotInProgress={isNotInProgress}
      usernameIsInvalid={usernameIsInvalid}
      passwordIsInvalid={passwordIsInvalid}
      isSubmitting={isSubmitting}
      canNotSubmit={canNotSubmit}
      onLogin={() => {
        send(
          api.status.eventCreators.submit(() =>
            fetchUser({
              username: foldString(current.context.username),
              password: foldString(current.context.password)
            })
          )
        );
      }}
      resetButton={resetButton}
    />
  );

  const content = pipe(
    api.status.selector(current.context),
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
