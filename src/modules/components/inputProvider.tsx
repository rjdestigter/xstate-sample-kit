// Libs
import * as React from "react";

import { BehaviorSubject, Observable } from "rxjs";
import { map, mapTo, tap } from "rxjs/operators";
import { useObservableState } from "observable-hooks";

import { assign, spawn } from "xstate";
import { useMachine } from "@xstate/react";

import { pipe } from "fp-ts/lib/pipeable";
import * as R from "fp-ts/lib/Reader";
import * as O from "fp-ts/lib/Option";
import * as S from "fp-ts/lib/Semigroup";
import { constant, identity, flow } from "fp-ts/lib/function";

// Modules
import createMachine, {
  State,
  change,
  reset,
  focus,
  blur,
  MachineConfig
} from "../machines/input-control";

// Utils
import { getEventCurrentTargetValue } from "../utils/getters";
import { returnLast, forward } from "../utils/functions";
import { isTruthy } from "../utils/assert";
import { voidFn } from "../utils/functions";
import { InputEvent, PropsOf } from "../types";
import { useServiceLogger } from "../xstate";
import { useSubject } from "../hooks";
import { Value, dotValue, isRobot } from "../streams/authentication";
import { Input, PropsInput } from "./input-controls/Input";
import { trim, pick } from "../utils";

// Streams
import { reset$ } from "../streams/reset";
import { makeHumanValue } from "../streams/authentication";

const inputEventIdentity = (event: InputEvent) => event;

const getEventValue = R.map<InputEvent, string>(getEventCurrentTargetValue);

export interface RenderProps {
  value: string;
  invalid: boolean;
  focused: boolean;
  onChange: R.Reader<React.FormEvent<HTMLInputElement>, string>;
  onFocus: () => void;
  onBlur: () => void;
}

export interface InputProviderArgs {
  name: string;
  isValid?: (value?: string) => boolean;
  withConfig?: (config: MachineConfig<string>) => MachineConfig<string>;
  value$: Observable<Value<string>>;
  update: (next: string) => void;
}

export const inputProvider = ({
  name,
  isValid = constant(true),
  withConfig,
  value$,
  update
}: InputProviderArgs) => {
  const defaultWithConfig = (
    config: MachineConfig<string>
  ): MachineConfig<string> => {
    const entry = config.entry
      ? Array.isArray(config.entry)
        ? config.entry
        : [config.entry]
      : [];

    return {
      ...config,
      context: {
        ...config.context,
        // @ts-ignore
        reset$Ref: null,
        // @ts-ignore
        change$Ref: null
      },
      entry: [
        ...entry,
        assign<any, any>({
          reset$Ref: () => spawn(reset$.pipe(mapTo(reset()))),
          change$Ref: () =>
            spawn(
              value$.pipe(
                tap(value => {
                  // debugger;
                }),
                map(value => change(dotValue(value), isRobot(value)))
              )
            )
        })
      ]
    };
  };

  const machine = createMachine<string>({
    isValid,
    withConfig: flow(defaultWithConfig, withConfig || identity)
  });

  const streamUsername = R.chain<InputEvent, string, string>(
    flow(returnLast(update, identity), constant)
  );

  const state$ = new BehaviorSubject<O.Option<State<string>>>(O.none);

  const stateIsValid = (state: State<string>) =>
    state.matches("valid.valid" as any);
  const mapStateIsValid = O.map(stateIsValid);

  // @ts-ignore
  const isValid$ = state$.pipe(
    map(maybeState =>
      pipe(maybeState, mapStateIsValid, O.fold(constant(false), identity))
    )
  );

  const Input: React.FC<{
    children: (renderProps: RenderProps) => JSX.Element;
  }> = props => {
    const [state, send, service] = useMachine(machine);

    if (process.env.NODE_ENV === "development") {
      useServiceLogger(service, `input(${name})`); // eslint-disable-line react-hooks/rules-of-hooks
    }

    useSubject(state$, state);
    const username = useObservableState(value$.pipe(map(dotValue)), "");

    const onChange = pipe(inputEventIdentity, getEventValue, streamUsername);
    const onFocus = flow(focus, send, voidFn);
    const onBlur = flow(blur, send, voidFn);

    return props.children({
      value: username,
      invalid:
        state.matches("touched.touched") && state.matches("valid.invalid"),
      focused: state.matches("focused.focused"),
      onChange,
      onFocus,
      onBlur
    });
  };

  Object.defineProperty(Input, "displayName", {
    value: `${name}(InputProvider)`
  });

  return [Input, isValid$, state$] as const;
};

export default inputProvider;

export const stringInputProvider = (
  name: string,
  options: {
    required?: boolean;
    isValid?: (value?: string) => boolean;
  } = {}
) => {
  const semigroupPredicate = S.getFunctionSemigroup(S.semigroupAll)<
    string | undefined
  >();

  const isValidFn = semigroupPredicate.concat(
    options.required ? isTruthy : constant(true),
    options.isValid || constant(true)
  );

  const value$ = new BehaviorSubject<Value<string>>({
    value: "",
    robot: true
  });

  const update = flow(
    trim,
    makeHumanValue,
    forward(value$.next.bind(value$)),
    dotValue
  );

  const [Provider, isValid$, state$] = inputProvider({
    name,
    isValid: isValidFn,
    value$,
    update
  });

  const picker = pick("invalid", "focused", "value");

  const InputComponent = (
    props: Omit<PropsInput, keyof RenderProps | "children"> & {
      children?: (
        childProps: Pick<RenderProps, "value" | "focused" | "invalid">
      ) => JSX.Element;
    }
  ) => (
    <Provider>
      {providedProps => (
        <>
          <Input {...props} {...providedProps} />
          {props.children
            ? props.children(picker(providedProps))
            : null}
        </>
      )}
    </Provider>
  );

  Object.defineProperty(InputComponent, "displayName", {
    value: `${name}(StringInputProvider)`
  });

  return [InputComponent, value$, isValid$, update, state$] as const;
};
