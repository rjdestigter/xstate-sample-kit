import * as React from "react";

import { identity, constant, flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import { fold as foldOption } from "fp-ts/lib/Option";

import { Api, Context, Event } from "../../machines/input-control";
import Input from "./Input";

import { getter2 } from "../../fp";

import { PropsOf } from "../../types";

export type ProvidedInputProps = Required<
  Pick<PropsOf<typeof Input>, "onChange" | "onFocus" | "onBlur"> & { value: string }
>;

export type PropsFromMachine<
  I extends string,
  TContext extends Context<string, I>
> = {
  send: (evt: Event<string>) => void;
  api: Api<string, I>;
  context: TContext;
  children: (inputProps: ProvidedInputProps) => JSX.Element;
};

const getEventValue = getter2("currentTarget", "value");

const bind = <T extends any[]>(f: (...t: T) => any) => (...t: T) => () => {
  f(...t);
};

const getEventTargetValue = getter2('currentTarget', 'value')

const FromMachine = <I extends string, TContext extends Context<string, I>>(
  props: PropsFromMachine<I, TContext>
) => {
  const value = pipe(
    props.api.selector(props.context),
    foldOption(constant(""), identity)
  );

  const inputProps: ProvidedInputProps = {
    value,
    onChange: flow(
      getEventTargetValue,
      props.api.eventCreators.change,
      props.send
    ),
    onFocus: bind(props.send)(props.api.eventCreators.focus()),
    onBlur: bind(props.send)(props.api.eventCreators.blur())
  };

  return props.children(inputProps);
};

export default FromMachine;
