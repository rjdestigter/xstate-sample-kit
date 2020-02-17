import React from "react";

import { useMachine } from "@xstate/react";

import LoginButton from "./LoginButton";
import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";
import ResetButton from "./ResetButton";
import Content from "../../../modules/components/Content";

import LoginForm from "../../../modules/components/LoginForm";

import { fetchUser } from "../../../modules/apis/login-api";

import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { constant } from "fp-ts/lib/function";

import { useServiceLogger } from "../../../modules/xstate";

import { getter, foldString } from "../../../modules/fp";

import { machine as loginMachine, api } from "../../../modules/machines/login";
import { isApiFailure, isDecodeFailure } from "../../../modules/apis/q";

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
    ? "Reset"
    : isSubmitting
    ? "Cancel"
    : loggedIn
    ? "Logout"
    : "Try again";

  const resetButton = (
    <ResetButton
      onClick={() => {
        send([
          api.status.eventCreators.reset(),
          api.username.eventCreators.reset(),
          api.password.eventCreators.reset()
        ]);
      }}
    >
      {resetText}
    </ResetButton>
  );

  const form = (
    <Content loading={isSubmitting}>
      <LoginForm
        usernameInput={
          <UsernameInput
            send={send}
            current={current}
            context={current.context}
          />
        }
        passwordInput={
          <PasswordInput
            send={send}
            current={current}
            context={current.context}
          />
        }
        loginButton={
          <LoginButton
            disabled={canNotSubmit}
            onClick={() => {
              send(
                api.status.eventCreators.submit(() =>
                  fetchUser({
                    username: foldString(current.context.username),
                    password: foldString(current.context.password)
                  })
                )
              );
            }}
          />
        }
        resetButton={resetButton}
      />
    </Content>
  );

  return pipe(
    api.status.selector(current.context),
    O.fold(constant(form), either =>
      pipe(
        either,
        E.fold(
          failure => {
            const failureMessage = isApiFailure(failure)
              ? `The server responded with code ${failure.error.code}: ${failure.error.error}`
              : isDecodeFailure(failure)
              ? `The server has responded with an unknown response.`
              : `The following error has occurred: ${failure.error}`
            return (
              <Content>
                <div className="fail">{failureMessage}</div>
                <br />
                {resetButton}
              </Content>
            );
          },
          user => {
            return (
              <Content>
                <div id="welcome">Welcome {getter("username")(user)}</div>
                {resetButton}
              </Content>
            );
          }
        )
      )
    )
  );
};

export default LoginApp;
