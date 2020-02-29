/**
 * @packageDocumentation
 * @module app/xassy-login
 * 
 */

import * as React from "react";

import Button from "../../../modules/components/input-controls/Button";
import { PropsOf } from "../../../modules/types";

import text from './text.json'

export interface PropsLoginButton extends PropsOf<typeof Button> {
  disabled: boolean;
  onClick: () => void;
}

const LoginButton = (props: PropsLoginButton) => (
  <Button  
    {...props}
    raised
    data-test="btn-login"
    disabled={props.disabled}
    onClick={props.onClick}
  >
    {text.Login}
  </Button>
);

export default LoginButton;
