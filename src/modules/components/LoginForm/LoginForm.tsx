import * as React from 'react'

import Typography from '../Typography'

export interface PropsLoginForm {
  usernameInput: React.ReactNode,
  passwordInput: React.ReactNode,
  loginButton: React.ReactNode,
  resetButton?: React.ReactNode,
}

const LoginForm = (props: PropsLoginForm) => (
  <form>
      <Typography use={"headline3"}>{"[title of show]"}</Typography>
      <br />
      <br />
      {props.usernameInput}
      <br />
      {props.passwordInput}
      <br />
      <div>
        {props.loginButton}
        {props.resetButton}
      </div>
    </form>
)

export default LoginForm