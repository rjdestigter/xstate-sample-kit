import * as React from "react";

import { Icon } from '@rmwc/icon'

import Input from "../Input";
import usernameLabel from "../../labels/usernameLabel";

import { PropsOf } from '../../../types'

type InputProps = PropsOf<typeof Input>;
export interface PropsUsername {
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

export const UsernameInput = (props: PropsUsername) => (
  <>
    <div>{usernameLabel}</div>
    <div>
      <Input
        data-test="input-username"
        value={props.value}
        placeholder="Username"
        required
        invalid={props.invalid}
        disabled={props.disabled}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        style={styles.block}
        helpText={{
          children: props.invalid ? <span>{"A username is required!"}</span> : "",
          validationMsg: true,
        }}
        icon={<Icon icon={'person'} theme={props.focused ? 'primary' : '' as any} />}
      />
    </div>
  </>
);

export default UsernameInput;
