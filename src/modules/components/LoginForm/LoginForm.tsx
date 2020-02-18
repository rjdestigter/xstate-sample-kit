import * as React from 'react'

import Typography from '../Typography'

import text from './text.json'
import { useTranslation } from 'react-i18next'

export interface PropsLoginForm {
  usernameInput: React.ReactNode,
  passwordInput: React.ReactNode,
  loginButton: React.ReactNode,
  resetButton?: React.ReactNode,
}

const LoginForm = (props: PropsLoginForm) => {
  const [t, i18n] = useTranslation();

  return (
  <form>
      <Typography use={"headline3"}>{`[${t(text.titleOfShow)}]`}</Typography>
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
  }

export default LoginForm