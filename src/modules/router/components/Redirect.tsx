/**
 * @packageDocumentation
 * @module router
 */
import * as React from "react";

import { SendContext, StateMachineContext } from "../../components/SendContext";

/**
 * Render prop function used by [[Redirect]]
 * @internal
 */
export const RedirectWithSend = (props: PropsRedirect & Pick<StateMachineContext, 'send'>) => {
  React.useEffect(() => {
    console.warn(`Redirecting to: ${props.to}`)
    props.send({ type: "GOTO", route: `${props.to}` });
  }, [props.to, props.send]);

  return null;
};

/**
 * React prop types for the [[Redirect]] component.
 */
export interface PropsRedirect {
  /** Path or url to redirect to */
  to: string;
}

/**
 * Transitions the router's state machine to a given path or url.
 * @param props See [[PropsRedirect]]
 */
const Redirect = (props: PropsRedirect) => {
  const { send } = React.useContext(SendContext);

  return (
    <RedirectWithSend {...props} send={send} />
  );
}

export default Redirect;
