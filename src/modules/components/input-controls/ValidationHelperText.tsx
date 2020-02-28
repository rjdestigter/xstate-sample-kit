import * as React from "react";
import { TextFieldHelperText } from "@rmwc/textfield";

export interface PropsValidationHelperText {
  invalid?: boolean;
  children?: React.ReactNode;
  defaultText?: React.ReactNode;
}

const ValidationHelperText = (props: PropsValidationHelperText) => {
  return (
    <TextFieldHelperText validationMsg persistent>
      {props.invalid ? props.children :  props.defaultText || <br />}
    </TextFieldHelperText>
  );
};

export default ValidationHelperText