/**
 * @packageDocumentation
 * @module components/FailureMessage
 * 
 */
import * as React from "react";

import { Failure, isApiFailure, isDecodeFailure } from "../../apis/q";

import { format } from "../../utils";

/**
 * React props for the [[FailureMessage]] component.
 */
export interface PropsFailureMessage {
  /** The [[Failure]] value */
  failure: Failure;
  /** Message displayed when the failure's reason is an error. */
  error?: string;
  /** Message to display when the failure was due to a decoding issue. */
  decode?: string;
  /** Message displayed when the failure describes a server returned error message.  */
  api?: string;
}

/**
 * React component for displaying API failure messages.
 * 
 */
const FailureMessage = (props: PropsFailureMessage) => {
  const failureMessage = isApiFailure(props.failure)
    ? format(props.api || '', props.failure.error.code, props.failure.error.error)
    : isDecodeFailure(props.failure)
    ? format(props.decode || '')
    : format(props.error || '', props.failure.error);

  return failureMessage ? <span data-test="FailureMessage">{failureMessage}</span> : null
};

export default FailureMessage