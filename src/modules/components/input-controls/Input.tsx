/**
 * @packageDocumentation
 * @module components
 * 
 */
import * as React from "react";

import { TextField } from "@rmwc/textfield";
import { PropsOf } from "../../types";

export * from "@rmwc/textfield";

export type PropsInput = PropsOf<typeof TextField> & {
  takeFocus?: any;
  onEnter?: () => void;
  invalid?: boolean;
};

export const Input = (props: PropsInput) => {
  const inputRef = React.useRef<null | HTMLInputElement>(null)
 
  // Hooks
  React.useLayoutEffect(() => {
    if (props.takeFocus) {
      setTimeout(
        () => inputRef.current?.focus(),
        100
      );
    }
  }, [props.takeFocus]);

  const onKeyPress = React.useMemo(
    () => (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.which === 13 && props.onEnter) {
        props.onEnter();
      } else if (props.onKeyPress) {
        props.onKeyPress(evt);
      }
    },
    [props.onEnter, props.onKeyPress]
  );

  // pROPS
  const {
    takeFocus,
    onEnter,
    ...textFieldProps
  } = props;

  // const status = dataStatus ? dataStatus : invalid ? "error" : undefined;

  return (
    <TextField
      {...textFieldProps}
      inputRef={inputRef}
      onKeyPress={onKeyPress}
    />
  );
};

export default Input;
