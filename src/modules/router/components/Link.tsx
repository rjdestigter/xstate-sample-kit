import * as React from "react";
import { Context } from "../machine";
import { Consumer, Send } from "../../SendContext";
import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import { constant, identity } from "fp-ts/lib/function";

export const linkWithSend = (props: PropsLink) => (send: Send) => {
  const onClick = pipe(
    send,
    O.map(f => f.bind(null, { type: "GOTO", route: props.to, ...props.params }, undefined)),
    O.fold(constant(undefined), identity)
  );

  return (
    <a href="#" onClick={onClick}>
      {props.children}
    </a>
  );
};

export interface PropsLink {
  to: string;
  params?: Context;
  children: React.ReactNode;
}

const Link = (props: PropsLink) => (
  <Consumer>{linkWithSend(props)}</Consumer>
);

export default Link
