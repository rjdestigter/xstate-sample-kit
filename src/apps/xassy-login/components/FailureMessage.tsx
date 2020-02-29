/**
 * @packageDocumentation
 * @module app/xassy-login
 * 
 */
import * as React from "react";

import CFailureMessage from "../../../modules/components/FailureMessage";
import { Failure } from "../../../modules/apis/q";

import text from './text.json'

export interface PropsFailureMessage {
  failure: Failure;
}

const FailureMessage = (props: PropsFailureMessage) => (
  <CFailureMessage
    failure={props.failure}
    api={text["The server responded with code %code"]}
    decode={text["The server has responded with an unknown response."]}
    error={text["The following error has occurred"]}
  />
);

export default FailureMessage
