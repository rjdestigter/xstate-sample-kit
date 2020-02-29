/**
 * @packageDocumentation
 * @module components
 *
 */
import * as React from "react";

import { Icon } from "@rmwc/icon";

import Input from "../Input";
import { PropsOf } from "../../../types";

type InputProps = PropsOf<typeof Input>;

export interface PropsPassword {
  value: string;
  onEnter: InputProps["onEnter"];
  onChange: InputProps["onChange"];
  onFocus: InputProps["onFocus"];
  onBlur: InputProps["onBlur"];
  style?: React.CSSProperties;
  disabled: boolean;
  invalid: boolean;
  focused: boolean;
  label?: string;
}

const styles = {
  input: { width: "100%" }
};

export const PasswordInput = (props: PropsPassword) => (
  <Input
    label={props.label || "Password"}
    data-test="input-password"
    value={props.value}
    type="password"
    outlined
    required
    data-status={props.invalid ? "error" : undefined}
    disabled={props.disabled}
    onEnter={props.onEnter}
    onChange={props.onChange}
    onFocus={props.onFocus}
    onBlur={props.onBlur}
    style={Object.assign({}, props.style, styles.input)}
    icon={
      <Icon
        icon={props.focused ? "lock_open" : "lock"}
        theme={props.focused ? "primary" : undefined}
      />
    }
    helpText={{
      children: props.invalid ? (
        <span>{"A password is required!"}</span>
      ) : (
        <br />
      ),
      validationMsg: true
    }}
  />
);

export default PasswordInput;
