import {
  StateType,
  EventType,
  Event,
  Context,
  State,
  Api,
  MachineOptions,
  MachineConfig,
  Config
} from "./types";

import {
  assign,
  createMachine as createStateMachine,
  send
} from "xstate";

import { fromNullable, Option, none } from "fp-ts/lib/Option";

import { prefixer } from "../../utils";
import { log } from "xstate/lib/actions";

/**
 * Raw configuration for input control state machines
 */
export const configuration = <I extends string>(options: { id: I }) => {
  const { id } = options;

  const prefix = prefixer(id);

  return {
    type: "parallel" as "parallel",
    states: {
      [StateType.Edit]: {
        entry: prefix("assignInitialValue"),
        on: {
          [prefix(EventType.Change)]: {
            actions: prefix("assignChange")
          }
        }
      },
      [StateType.Pristine]: {
        initial: StateType.Pristine,
        states: {
          [StateType.Pristine]: {
            on: {
              [prefix(EventType.Change)]: {
                target: StateType.Dirty,
                cond: "isHuman"
              }
            }
          },
          [StateType.Dirty]: { entry: log((ctx, event, meta) => ({ctx, event, meta})) as any, type: "final" as const }
        }
      },
      [StateType.Touched]: {
        initial: StateType.Untouched,
        states: {
          [StateType.Untouched]: {
            on: {
              [prefix(EventType.Focus)]: {
                target: StateType.Touching,
              },
            }
          },
          [StateType.Touching]: {
            on: {
              [prefix(EventType.Blur)]: {
                target: StateType.Touched,
              },
            }
          },
          [StateType.Touched]: { type: "final" as const }
        }
      },
      [StateType.Valid]: {
        initial: StateType.Invalid,
        states: {
          [StateType.Invalid]: {
            on: {
              [prefix(EventType.Change)]: {
                target: StateType.Valid,
                cond: prefix("isValid")
              }
            }
          },
          [StateType.Valid]: {
            on: {
              [prefix(EventType.Change)]: {
                target: StateType.Invalid,
                cond: prefix("isNotValid")
              }
            }
          }
        }
      },
      [StateType.Focused]: {
        initial: StateType.Blurred,
        states: {
          [StateType.Focused]: {
            on: {
              [prefix(EventType.Blur)]: StateType.Blurred
            }
          },
          [StateType.Blurred]: {
            on: {
              [prefix(EventType.Focus)]: StateType.Focused
            }
          }
        }
      }
    }
  };
};

export type ConfigureParams<T, I extends string> = {
  id: I;
  isValid: (value: Option<T>) => boolean;
  initialValue?: T;
};

/**
 * Create configuration for a input control state machine.
 * @param param0
 */

export function configure<T, I extends string>(
  params: ConfigureParams<T, I>
): Config<T, I> {
  type ChangeEvent = Extract<Event<T>, { type: typeof EventType.Change }>;
  type FocusEvent = Extract<Event<T>, { type: typeof EventType.Focus }>;
  type BlurEvent = Extract<Event<T>, { type: typeof EventType.Blur }>;

  const { id, isValid, initialValue } = params;

  const prefix = prefixer(id);

  const api: Api<T, I> = {
    eventCreators: {
      change: (value: T): ChangeEvent => ({
        type: prefix(EventType.Change),
        value
      }),
      focus: (): FocusEvent => ({ type: prefix(EventType.Focus) }),
      blur: (): BlurEvent => ({ type: prefix(EventType.Blur) })
    },
    selector: (ctx: Context<T, I>) => ctx[id] ?? none
  };

  const isChangeEvent = (event: Event<T>): event is ChangeEvent =>
    event.type === prefix(EventType.Change);

  const config: MachineConfig<T, I> = configuration({ id });

  const assignChange = assign<Context<T, I>, Event<T>>((ctx, e) => {
    const value = isChangeEvent(e) ? fromNullable(e.value) : ctx[id];

    return {
      [id]: value
    } as any;
  });

  const assignInitialValue = send<Context<T, I>, Event<T>>(
    (ctx, e): ChangeEvent => {

      return {
        type: prefix(EventType.Change),
        value: initialValue,
        isRobot: true
      };
    }
  );

  const options: MachineOptions<T, I> = {
    actions: {
      [prefix("assignInitialValue")]: assignInitialValue,
      [prefix("assignChange")]: assignChange
    },
    guards: {
      isHuman: (_, e) => {
        return isChangeEvent(e) ? !e.isRobot : false
      },
      [prefix("isValid")]: (ctx: Context<T, I>, e: Event<T>) =>
        isValid(isChangeEvent(e) ? fromNullable(e.value) : api.selector(ctx)),
      [prefix(`isNotValid`)]: (ctx: Context<T, I>, e: Event<T>) =>
        !isValid(isChangeEvent(e) ? fromNullable(e.value) : api.selector(ctx))
    }
  };

  return {
    id,
    config,
    options,
    api
  };
}

/**
 * Create a [[Machine]] for controlling inputs.
 *
 * @typeparam T The type the machine outputs. Defaults to `string`
 * @param initialValue The initial value of the machine
 * @returns A state machine for controlling inputs.
 */
export const createMachine = <T, I extends string>({
  id,
  initialValue,
  isValid = (_: Option<T>) => true
}: {
  id: I;
  initialValue?: T;
  isValid?: (value: Option<T>) => boolean;
}) => {
  const { config, options, api } = configure({ id, isValid, initialValue });

  return Object.assign(
    createStateMachine<Context<T, I>, Event<T>, State<T, I>>(
      {
        id,
        ...config
      },
      options
    ),
    { api }
  );
};
