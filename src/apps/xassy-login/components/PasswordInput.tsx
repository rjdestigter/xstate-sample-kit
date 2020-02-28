// Libs
import * as React from "react";

// Boilerplate
import makeInput, { RenderProps } from "../../../modules/components/inputProvider";

// Components
import PasswordInput, {
  PropsPassword
} from "../../../modules/components/input-controls/Password";

// Utils
import { isTruthy } from "../../../modules/utils/assert";

// Streams
import {
  password$,
  setPassword,
} from "../../../modules/streams/authentication";


export const [InputProvider, isValid$, state$] = makeInput({
  name: "password",
  isValid: isTruthy,
  update: setPassword,
  value$: password$,
});

const Password = (props: Omit<PropsPassword, keyof RenderProps>) => {
  return (
    <InputProvider>
      {providedProps => (
        <PasswordInput {...providedProps} {...props} />
      )}
    </InputProvider>
  );
};

export default Password;

