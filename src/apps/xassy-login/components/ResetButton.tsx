/**
 * @packageDocumentation
 * @module app/xassy-login
 * 
 */

import * as React from "react";

// Components
import Button from "../../../modules/components/input-controls/Button";

// Modules
import { PropsOf } from "../../../modules/types";

export interface PropsResetButton
  extends Omit<PropsOf<typeof Button>, "onClick" | "children"> {
  children: React.ReactNode;
  onClick: () => void;
  takeFocus?: boolean;
}

const ResetButton = (props: PropsResetButton) => {
  const ref = React.useRef<HTMLButtonElement | null>(null);

  React.useLayoutEffect(() => {
    if (props.takeFocus) {
      setTimeout(
        () => {
          ref.current?.focus()
        },
        250
      );
    }
  }, [props.takeFocus, ref.current]);

  return (
    <Button
      ref={ref}
      data-test="btn-reset"
      // disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export default ResetButton;
