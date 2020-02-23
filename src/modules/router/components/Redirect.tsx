import * as React from "react";

import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import { constant, identity } from "fp-ts/lib/function";

import { Consumer, Send } from "../../SendContext";

export const redirectWithSend = (props: PropsRedirect) => (send: Send) => {
  React.useEffect(() => {
    const redirect = pipe(
      send,
      O.map(f => () => {f({ type: "GOTO", route: props.to })}),
      O.fold(constant(() => {}), identity)
    );

    redirect()
  }, [props.to]);

  return null;
};

export interface PropsRedirect {
  to: string;
}

const Redirect = (props: PropsRedirect) => (
  <Consumer>{redirectWithSend(props)}</Consumer>
);

export default Redirect
