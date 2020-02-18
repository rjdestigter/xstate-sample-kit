import * as React from "react";

import { Failure, isApiFailure, isDecodeFailure } from "../../apis/q";
import { format } from "../../utils";

export interface PropsFailureMessage {
  failure: Failure;
  error?: string;
  decode?: string;
  api?: string;
}

const f = (str?: string, ...args: any[]) => (str ? format(str, ...args) : null);

const FailureMessage = (props: PropsFailureMessage) => {
  const failureMessage = isApiFailure(props.failure)
    ? f(props.api, props.failure.error.code, props.failure.error.error)
    : isDecodeFailure(props.failure)
    ? f(props.decode)
    : f(props.error, props.failure.error);

  return failureMessage ? <span data-test="FailureMessage">{failureMessage}</span> : null
};

export default FailureMessage