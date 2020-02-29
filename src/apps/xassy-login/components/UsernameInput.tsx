/**
 * @packageDocumentation
 * @module app/xassy-login
 * 
 */

// Libs
import * as React from "react";
import { mapTo, scan } from "rxjs/operators";
import { useObservableState } from "observable-hooks";

// Boilerplate
import makeInput, { RenderProps } from "../../../modules/components/inputProvider";

// Components
import UsernameInput, {
  PropsUsername
} from "../../../modules/components/input-controls/Username";

// Utils
import { isTruthy } from "../../../modules/utils/assert";

// Streams
import {
  username$,
  setUsername,
} from "../../../modules/streams/authentication";


import { reset$ } from "../../../modules/streams/reset";

const takeFocus$ = reset$.pipe(
  mapTo(2),
  scan((acc, next) => acc + next)
);

export const [InputProvider, isValid$, state$] = makeInput({
  name: "username",
  isValid: isTruthy,
  update: setUsername,
  value$: username$,
});

const Username = (props: Omit<PropsUsername, keyof RenderProps | 'takeFocus'>) => {
  const takeFocus = useObservableState(takeFocus$, 1);

  return (
    <InputProvider>
      {providedProps => (
        <UsernameInput {...providedProps} {...props} takeFocus={takeFocus} />
      )}
    </InputProvider>
  );
};

export default Username;
