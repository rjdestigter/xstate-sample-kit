import * as React from "react";

// Components
import Button from "../../../modules/components/input-controls/Button";

// Modules
import { PropsOf } from "../../../modules/types";

export interface PropsResetButton
  extends Omit<PropsOf<typeof Button>, "onClick" | "children"> {
  children: React.ReactNode;
  onClick: () => void;
}

const ResetButton = (props: PropsResetButton) => (
  <Button
    data-test="btn-reset"
    type="button"
    theme="secondary"
    onClick={props.onClick}
  >
    {props.children}
  </Button>
);

export default ResetButton;
