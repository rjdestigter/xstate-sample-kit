import * as React from "react";

import text from "./text.json";
import { useTranslation } from "react-i18next";
import { FormField, FormFields } from "../FormField";

import Typography from '../Typography'

export interface PropsLoginForm {
  usernameInput: React.ReactNode;
  passwordInput: React.ReactNode;
  loginButton: React.ReactNode;
  resetButton?: React.ReactNode;
}

const LoginForm = (props: PropsLoginForm) => {
  const [t] = useTranslation();

  return (
    <form>
      <FormField><Typography use={'headline6'}>{`[${t(text.titleOfShow)}]`}</Typography></FormField>
      <FormField>{props.usernameInput}</FormField>
      <FormField>{props.passwordInput}</FormField>
      <FormFields horizontal centered>
        <FormField>{props.loginButton}</FormField>
        <FormField>{props.resetButton}</FormField>
      </FormFields>
    </form>
  );
};

export default LoginForm;
