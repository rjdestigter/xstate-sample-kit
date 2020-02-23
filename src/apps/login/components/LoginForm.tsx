import React from "react";

import CLoginForm from "../../../modules/components/LoginForm";

import LoginButton from "./LoginButton";
import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";

export interface PropsLoginForm {
  isSubmitting: boolean;
  canNotSubmit: boolean;
  onLogin: () => void;
  resetButton: React.ReactNode;
}

const LoginForm = (props: PropsLoginForm) => {
  return (
    <CLoginForm
      usernameInput={<UsernameInput disabled={props.isSubmitting} />}
      passwordInput={<PasswordInput disabled={props.isSubmitting} />}
      loginButton={
        <LoginButton disabled={props.canNotSubmit} onClick={props.onLogin} />
      }
      resetButton={props.resetButton}
    />
  );
};

export default LoginForm;
