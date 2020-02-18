import * as React from "react";

import { State } from "xstate";

import Button from "../../../modules/components/input-controls/Button";

import { PropsOf } from "../../../modules/types";

import {
  Context as InputControlContext,
  Event as InputControlEvent
} from "../../../modules/machines/input-control";

import { api } from "../../../modules/machines/login";

export interface PropsResetButton
  extends Omit<PropsOf<typeof Button>, "onClick" | "children"> {
  children: React.ReactNode;
  send: (evt: InputControlEvent<string> | InputControlEvent<string>[]) => void;
}

const ResetButton = (props: PropsResetButton) => (
  <Button
    {...props}
    data-test="btn-reset"
    type="button"
    theme="secondary"
    onClick={() => {
      props.send([
        api.status.eventCreators.reset(),
        api.username.eventCreators.reset(),
        api.password.eventCreators.reset()
      ]);
    }}
  >
    {props.children}
  </Button>
);

export default ResetButton;
