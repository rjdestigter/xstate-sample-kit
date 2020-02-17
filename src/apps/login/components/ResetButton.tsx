import * as React from "react";

import Button from "../../../modules/components/input-controls/Button";

import { PropsOf } from "../../../modules/types";

export interface PropsResetButton extends PropsOf<typeof Button> {
  onClick: () => void;
  children: React.ReactNode;
}

const ResetButton = (props: PropsResetButton) => (
  <Button
    {...props}
    data-test="btn-reset"
    type="button"
    theme="secondary"
    onClick={props.onClick}
  >
    {props.children}
  </Button>
);

export default ResetButton;
