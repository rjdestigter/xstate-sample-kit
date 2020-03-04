/**
 * ### inputProvider
 *
 * Create a state machine controlled text input element with it's corresponding observable stream.
 *
 * @packageDocumentation
 * @module modules/inputProvider
 * @preferred
 *
 */

// React
import * as React from "react";

// RxJS
import { BehaviorSubject, Observable } from "rxjs";
import { map, mapTo } from "rxjs/operators";
import { useObservableState } from "observable-hooks";

// XState
import { assign, spawn } from "xstate";
import { useMachine } from "@xstate/react";

// fp-ts
import { pipe } from "fp-ts/lib/pipeable";
import * as R from "fp-ts/lib/Reader";
import * as O from "fp-ts/lib/Option";
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
import { forward } from "../utils/functions";
import { isTruthy } from "../utils/assert";
import { voidFn } from "../utils/functions";
import { InputEvent } from "../types";
import { useServiceLogger } from "../xstate";
import { useSubject } from "../hooks";
import { Value, dotValue, isRobot } from "../streams/authentication";
import { Input, PropsInput } from "./input-controls/Input";
import { trim, pick, semigroupPredicate, constantTrue } from "../utils";

// Streams
import { reset$ } from "../streams/reset";
import { makeHumanValue } from "../streams/authentication";

/**
 * Identify function of [[InputEvent]]. Only used for type information.
 */
const inputEventIdentity = (event: InputEvent) => event;

/**
 * Map a function of (InputEvent -> a) to (string -> a)
 */
const getEventValue = R.map<InputEvent, string>(getEventCurrentTargetValue);

/**
 * Picker function that takes on object with "invalid", "focused", "value"
 * and returns an object with only those keys
 */
const picker = pick("invalid", "focused", "value");

/**
 * Return type of [[inputProvider]]. A tuple of:
 * 
 * - A react component for entering text input
 * - A stream that emits true or false depending on if the state machine is in a valid state
 * - A stream that emits the state machine's state
 */
export type InputProvisions = [
  React.FC<{
    children: (renderProps: RenderProps) => JSX.Element;
  }>,
  Observable<boolean>,
  BehaviorSubject<O.Option<State<string>>>
]

/**
 * Return type of [[stringInputProvider]]. A tuple of:
 * 
 * - A react component for entering text input
 * - A stream that emits the input's value
 * - A stream that emits the state machine validity state
 * - A function for sending value's to the input stream
 * - A stream that emits the state machine's state
 * 
 */
export type StringInputProvisions = [
  React.FC<PropsStringInput>,
  BehaviorSubject<Value<string>>,
  Observable<boolean>,
  (value: string) => string,
  BehaviorSubject<O.Option<State<string>>>
]

/**
 * Render props passed to the child of the created input component.
 */
export interface RenderProps {
  /** The input's current value */
  value: string;
  /** Whether the input is valid. (False if not touched) */
  invalid: boolean;
  /** Whether the input has focus */
  focused: boolean;
  /** onChange callback */
  onChange: R.Reader<React.FormEvent<HTMLInputElement>, void>;
  /** onFocus callback */
  onFocus: () => void;
  /** onBlur callback */
  onBlur: () => void;
}

/**
 * React props for the component returned by [[stringInputProvider]].
 * It omits `onChange`, `onFocus`, and `onBlur` from [[RenderProps]]
 * as those are created by it.
 */
export type PropsStringInput = Omit<PropsInput, keyof RenderProps | "children"> & {
  children?: (
    renderProps: Pick<RenderProps, "value" | "focused" | "invalid">
  ) => JSX.Element;
}

/**
 * Function arguments for [[inputProvider]]
 */
export interface InputProviderArgs {
  /**
   * Unique name for the controlled input. The name is passed to
   * `useServiceLogger` to create a unique group name for logging
   * the state machine's transitions. It is also used to create
   * unique display name for the created input component.   *
   * */
  name: string;

  /**
   * Validates the data the input generates. This is passed to the function
   * that creates the input-control state machine. The state machine uses
   * it to determine whether to move into a valid or invalid state based
   * on the change event's value or it's current value in context.
   * */
  isValid?: (value?: string) => boolean;

  /**
   * Callback for overriding the state machine's default configuration.
   * This allows you to add more configuration to the input-control
   * state machine. For example, you might spawn an observable on entry
   * that listens for external signals and dispatch events to the state
   * machine.
   * */
  withConfig?: (config: MachineConfig<string>) => MachineConfig<string>;

  /**
   * Stream that provides the value. The input-control state machine spawns
   * this observable on entry and dispatches it's internal change event
   * any time the stream emits a value.
   * */
  value$: Observable<Value<string>>;

  /**
   * Updater function that reives the next value. In most cases this is:
   * BehaviourSubject.next.
   * */
  update: (next: string) => void;
}

/**
 * Boiler plate code for managing form controls with a
 * state machine that manages:
 * - Focus state
 * - Pristine state
 * - Valid state
 * - Touched state
 */
export const inputProvider = (params: InputProviderArgs): InputProvisions => {
  //
  const {
    name,
    isValid = constant(true),
    withConfig,
    value$,
    update
  } = params

  /**
   * Default state machine configuration.
   */
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
          // On entry, spawn the reset$ observable and map it to
          // the RESET event that will reset the state machine.
          reset$Ref: () => spawn(reset$.pipe(mapTo(reset()))),
          // On entry, spawn the value$ observable and map it to
          // the CHANGE event
          change$Ref: () =>
            spawn(
              value$.pipe(map(value => change(dotValue(value), isRobot(value))))
            )
        })
      ]
    };
  };

  // Create the state machien controlling the text input element
  const machine = createMachine<string>({
    isValid,
    withConfig: flow(defaultWithConfig, withConfig || identity)
  });

  // Create an observable used to stream the machines state
  const state$ = new BehaviorSubject<O.Option<State<string>>>(O.none);

  /**
   * ```hs
   * streamNextValue :: Reader InputEvent string -> Reader InputEvent string
   * ```
   *
   * ```ts
   * (ma: R.Reader<InputEvent, string>) => R.Reader<InputEvent, string>
   * (ma: (event: InputEvent) => string) => (event: InputEvent) => string
   * ```
   *
   * This looks more complicated than it is:
   *
   * `streamNextValue` is a function that:
   *
   * - Takes a function named `ma` from [[InputEvent]] -> string as it's argument.
   * - Returns a function with the exact same signature.
   *
   *  Internally it takes the input event and passes it to function
   * that it has been given as the argument which in turn gives it the
   * string value that `update` is called with
   */
  const streamNextValue = R.chain<InputEvent, string, void>(
    flow(update, constant(voidFn))
  );

  /**
   * Checks if a given input control state is in a valid state.
   */
  const stateIsValid = (state: State<string>) =>
    state.matches("valid.valid" as any);

  /**
   * Function that take's an option of state and returns an option of a boolean.
   */
  const mapStateIsValid = O.map(stateIsValid);

  /**
   * Stream that map the state machines state to a boolean flag indicating
   * it's validity.
   */
  const isValid$ = state$.pipe(
    map(flow(mapStateIsValid, O.fold(constant(false), identity)))
  );

  const Input: React.FC<{
    children: (renderProps: RenderProps) => JSX.Element;
  }> = props => {
    /**
     * Use the input-control state machine
     */
    const [state, send, service] = useMachine(machine);

    /**
     * In development mode, log it's state transitions
     */
    if (process.env.NODE_ENV === "development") {
      useServiceLogger(service, `input(${name})`); // eslint-disable-line react-hooks/rules-of-hooks
    }

    /**
     * Update the state$ stream on every render with the next state.
     */
    useSubject(state$, state);

    /**
     * Subscribe to the stream of values
     */
    const username = useObservableState(value$.pipe(map(dotValue)), "");

    /**
     * Create the onChange, onFocus, and, onBlur callback functions.
     * 
     * Experimented with the Reader monad to map over the transformations.
     * I start with `inputEventIdentity` which is just:
     * 
     * ```ts
     * (event: InputEvent) => InputEvent
     * ```
     * 
     * and equals to `R.Reader<InputEvent, InputEvent>`
     * 
     * Then, since Reader is a functor with mapping capabilities I 
     * map it from (Event -> ?) to (string -> ?) using `getEventValue`
     * 
     */
    const onChange = pipe(inputEventIdentity, getEventValue, streamNextValue);
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

  /**
   * Adjust the input component's display name.
   */
  Object.defineProperty(Input, "displayName", {
    value: `${name}(InputProvider)`
  });

  /**
   * Return the
   *
   * - The Input component
   * - The stream that emits the state machines validity state
   * - The stream that emits the state machines state
   */
  return [Input, isValid$, state$];
};


export default inputProvider;

/**
 * Options for [[stringInputProvider]]
 */
export interface StringInputProviderOptions {
  /** Flag indicating the created input component controls a required field. */
  required?: boolean;
  /**
   * See [[InputProviderArgs['isValid]]]
   */
  isValid?: (value?: string) => boolean;
}

/**
 * ```hs
 * stringInputProvider :: String -> { required :: Bool, isValid :: String -> Bool } -> StringInputProvisions
 * ```
 * @param name See [[InputProviderArgs['name']]]
 * @param options
 */
export const stringInputProvider = (
  name: string,
  options: {
    required?: boolean;
    isValid?: (value?: string) => boolean;
  } = {}
): StringInputProvisions => {
  /**
   * Create a `isValid` function by merging:
   * `isTruthy` if the field is required or constantTrue if not
   * and `options.isValid` or constantTrue
   */
  const isValidFn = semigroupPredicate.concat(
    options.required ? isTruthy : constantTrue,
    options.isValid || constantTrue
  );

  /**
   * Create a new value$ stream
   */
  const value$ = new BehaviorSubject<Value<string>>({
    value: "",
    robot: true
  });

  /**
   * Create the update function.
   */
  const update = flow(
    trim,
    makeHumanValue,
    forward(value$.next.bind(value$)),
    dotValue
  );

  /**
   *
   */
  const [Provider, isValid$, state$] = inputProvider({
    name,
    isValid: isValidFn,
    value$,
    update
  });

  
  /**
   * 
   * @param props 
   */
  const StringInput: React.FC<PropsStringInput> = (
    props: PropsStringInput
  ) => (
    <Provider>
      {providedProps => (
        <>
          <Input {...props} {...providedProps} />
          {props.children ? props.children(picker(providedProps)) : null}
        </>
      )}
    </Provider>
  );

  Object.defineProperty(StringInput, "displayName", {
    value: `${name}(StringInputProvider)`
  });

  return [StringInput, value$, isValid$, update, state$];
};




