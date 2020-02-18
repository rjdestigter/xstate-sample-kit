import * as React from "react";

import FailureMessageC from "./FailureMessage";
import LoginFormC from './LoginForm'

import '../../App.scss'

export const FailureMessage = () => (
  <FailureMessageC
    failure={{ reason: "api", error: { code: 404, error: "Not Found" } }}
    api="Not Found"
  />
);

export const LoginForm = () => (
  <LoginFormC 
    loginButton={<button>Login</button>}
    passwordInput={<input />}
    usernameInput={<input />}
    resetButton={<button>reset</button>}
  />
)

export default {
  title: "Components",
  component: FailureMessage
};
