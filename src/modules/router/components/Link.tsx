/**
 * @packageDocumentation
 * @module router
 */
import * as React from "react";
import { SendContext, StateMachineContext } from "../../components/SendContext";


/**
 * React props type for the  [[Link]] component.
 */
export interface PropsLink {
  /** Path or url to link to */
  to: string;
  /** Object, additional data dispatched with the [[GOTO]] event when the user clicks the link. */
  params?: any;
  /** Link text or label */
  children: (renderProps: { onClick: () => void }) => JSX.Element;
}

/**
 * React component for rendering links that dispatch routing events
 * to the router's state machine.
 * 
 * Example:
 * 
 * ```tsx
 * const menu = (
 *  <nav>
 *    <Link disabled>{t('Contact us)}</Link>
 *  </nav>
 * )
 * ```
 * 
 * @param props See [[PropsLink]] and any props accepted by the Atomic UI Library's `a-link` web component.
 */
const Link = (props: PropsLink) => {
  const context = React.useContext(SendContext);
  const onClick = context.send.bind(null, { type: "GOTO", route: props.to, ...props.params }, undefined)

  return props.children({onClick})

  // return linkWithSend(props)(context)
}

export default Link
