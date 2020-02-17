import React from "react";

import { useMachine } from "@xstate/react";

import LoginButton from "./LoginButton";
import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";
import ResetButton from "./ResetButton";

import LinearProgress from "../../../modules/components/LinearProgress";
import LoginForm from "../../../modules/components/LoginForm";

import { fetchUser } from "../../../modules/apis/login-api";

import { fold as foldOption } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { constant } from "fp-ts/lib/function";
import { fold as foldEither } from "fp-ts/lib/Either";

import { useServiceLogger } from "../../../modules/xstate";

import { getter, foldString } from "../../../modules/fp";

import { machine as loginMachine, api } from "../../../modules/machines/login";

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
    foldOption(constant(false), either =>
      pipe(either, foldEither(constant(false), constant(true)))
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
    <>
      <LinearProgress progress={isSubmitting ? undefined : 0} />
      <div style={{
       flex: '1 1 auto',
       display: 'flex',
       flexDirection: 'column',
       justifyContent: 'center',
       alignItems: 'center'
      }}>
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
      </div>
    </>
  );

  return pipe(
    api.status.selector(current.context),
    foldOption(constant(form), either =>
      pipe(
        either,
        foldEither(
          constant(
            <>
              <div className="fail">Something went terribly wrong!</div>
              <br />
              {resetButton}
            </>
          ),
          user => {
            return (
              <>
                <div id="welcome">Welcome {getter("username")(user)}</div>
                {resetButton}
              </>
            );
          }
        )
      )
    )
  );
};

export default LoginApp;
