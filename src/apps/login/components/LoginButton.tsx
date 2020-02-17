import * as React from "react";

import Button from "../../../modules/components/input-controls/Button";
import { PropsOf } from "../../../modules/types";

export interface PropsLoginButton extends PropsOf<typeof Button> {
  disabled: boolean;
  onClick: () => void;
}

const LoginButton = (props: PropsLoginButton) => (
  <Button
    {...props}
    type="button"
    data-test="btn-login"
    raised
    disabled={props.disabled}
    onClick={props.onClick}
  >
    {"Login"}
  </Button>
);

export default LoginButton;
