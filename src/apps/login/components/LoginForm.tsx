import React from "react";

import Content from "../../../modules/components/Content";
import CLoginForm from "../../../modules/components/LoginForm";

import LoginButton from "./LoginButton";
import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";

export interface PropsLoginForm {
  send: any;
  current: any;
  onLogin: () => void;
  resetButton: React.ReactNode;
  isInProgress: boolean;
  isNotInProgress: boolean;
  usernameIsInvalid: boolean;
  passwordIsInvalid: boolean;
  isSubmitting: boolean;
  canNotSubmit: boolean;
}

const LoginForm = (props: PropsLoginForm) => {
  return (
    <Content loading={props.isSubmitting}>
      <CLoginForm
        usernameInput={
          <UsernameInput
            send={props.send}
            current={props.current}
            context={props.current.context}
          />
        }
        passwordInput={
          <PasswordInput
            send={props.send}
            current={props.current}
            context={props.current.context}
          />
        }
        loginButton={
          <LoginButton
            disabled={props.canNotSubmit}
            onClick={props.onLogin}
          />
        }
        resetButton={props.resetButton}
      />
    </Content>
  );
};

export default LoginForm;
