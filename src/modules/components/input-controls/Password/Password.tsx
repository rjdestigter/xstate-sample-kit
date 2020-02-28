import * as React from "react";

import { Icon } from "@rmwc/icon";

import Input from "../Input";
import passwordLabel from "../../labels/passwordLabel";
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
}

const styles = {
  block: { display: "block" }
};

export const PasswordInput = (props: PropsPassword) => (
  <>
    <div>{passwordLabel}</div>
    <div>
      <Input
        data-test="input-password"
        value={props.value}
        placeholder="Password"
        type="password"
        required
        data-status={props.invalid ? "error" : undefined}
        disabled={props.disabled}
        onEnter={props.onEnter}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        style={Object.assign({}, props.style, styles.block)}
        icon={<Icon icon={props.focused ? 'lock_open' : 'lock'} theme={props.focused  ? 'primary' : undefined} />}
        helpText={{
          children: props.invalid ? <span>{"A password is required!"}</span> : <br />,
          validationMsg: true,        
        }}
      />
    </div>
  </>
);

export default PasswordInput;
