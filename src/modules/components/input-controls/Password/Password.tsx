import * as React from "react";

import { Icon } from '@rmwc/icon'

import Input from "../Input";
import passwordLabel from "../../labels/passwordLabel";
import { PropsOf } from "../../../types";

type InputProps = PropsOf<typeof Input>;

export interface PropsPassword {
  value: string;
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
        invalid={props.invalid}
        disabled={props.disabled}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        style={Object.assign({}, props.style, styles.block)}
        helpText={{
          children: props.invalid ? (
            <span>{"A password is required!"}</span>
          ) : (
            ""
          ),
          validationMsg: true
        }}
        withLeadingIcon={<Icon icon={props.focused ? "lock_open" : "lock"} theme={props.focused ? 'primary': '' as any} />}
      />
    </div>
  </>
);

export default PasswordInput;
