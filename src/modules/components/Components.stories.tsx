import * as React from "react";

import Button from "../../modules/components/input-controls/Button";
import Input from "../../modules/components/input-controls/Input";
import LoginFormC from './LoginForm'

import '../../App.scss'
import { action } from "@storybook/addon-actions";

export const LoginForm = () => (
  <LoginFormC 
    loginButton={<Button onClick={action('Logging in...')}>Login</Button>}
    passwordInput={<Input onChange={action('Change')} />}
    usernameInput={<Input onChange={action('Change')} />}
    resetButton={<Button onClick={action('Resetting...')}>Reset</Button>}
  />
)

export default {
  title: "Modules/Components/LoginForm",
  component: LoginForm
};
