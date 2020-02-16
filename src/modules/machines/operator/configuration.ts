import {
  StateType,
  EventType,
  Event,
  Context,
  Api,
  MachineOptions,
  MachineConfig,
  Config
} from "./types";

import { assign } from "xstate";

import {
  some,
  Option,
  fromNullable,
  map as mapOption,
  none
} from "fp-ts/lib/Option";

import { prefixer } from "../../utils";
import { Either, left, right } from "fp-ts/lib/Either";
import { identity, flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import { getter } from "../../fp";
import { isDoneInvokeEvent } from "../../xstate";

/**
 * Raw configuration for input control state machines
 */
export const configuration = <L, R, I extends string>(options: { id: I }) => {
  const { id } = options;

  const prefix = prefixer(id);

  return {
    initial: StateType.InProgress,
    states: {
      [StateType.InProgress]: {
        entry: prefix("assignInitial"),
        on: {
          [prefix(EventType.Submit)]: {
            target: StateType.Submitting
            // cond: 'canSubmit'
          }
        }
      },
      [StateType.Submitting]: {
        invoke: {
          id: prefix("submitOperation"),
          src: prefix("submitOperation"),
          onDone: StateType.Succeeded,
          onError: StateType.Failed
        },
        on: {
          [prefix(EventType.Succeed)]: {
            target: StateType.Succeeded
          },
          [prefix(EventType.Fail)]: {
            target: StateType.Failed,
            actions: "assignError"
          }
        }
      },
      [StateType.Succeeded]: {
        entry: prefix("assignSuccessOrFailure")
      },
      [StateType.Failed]: {
        entry: prefix("assignSuccessOrFailure"),
        on: {
          "": StateType.InProgress
        }
      }
    }
  };
};

export type ConfigureParams<L, R, I extends string> = {
  id: I;
  initialValue?: Either<L, R>;
};

/**
 * Create configuration for a input control state machine.
 * @param param0
 */

export function configure<L, R, I extends string>(
  params: ConfigureParams<L, R, I>
): Config<L, R, I> {
  type SubmitEvent = Extract<Event<L, R>, { type: typeof EventType.Submit }>;
  type SucceedEvent = Extract<Event<L, R>, { type: typeof EventType.Succeed }>;
  type FailEvent = Extract<Event<L, R>, { type: typeof EventType.Fail }>;

  const { id } = params;

  const prefix = prefixer(id);

  const api: Api<L, R, I> = {
    eventCreators: {
      submit: (promiser: () => Promise<Either<L, R>>): SubmitEvent => ({
        type: prefix(EventType.Submit),
        promiser
      }),
      fail: (error?: L): FailEvent => ({ type: prefix(EventType.Fail), error }),
      succeed: (): SucceedEvent => ({ type: prefix(EventType.Succeed) })
    },
    selector: (ctx: Context<L, R, I>) => ctx[id] ?? none
  };

  const isEvent = <E extends Event<L, R>["type"]>(eventType: E) => (
    event: Event<L, R>
  ): event is Extract<Event<L, R>, { type: E }> =>
    event.type === prefix(eventType);

  const isFailEvent = isEvent(EventType.Fail);
  const isSubmitEvent = isEvent(EventType.Submit);

  const config: MachineConfig<L, R, I> = configuration({ id });

  const assignInitial = assign<Context<L, R, I>, Event<L, R>>((ctx) => {   
    return {
      [id]: none
    } as any;
  });

  const assignError = assign<Context<L, R, I>, Event<L, R>>((ctx, e) => {
    const value: Option<Either<L, R>> = isFailEvent(e)
      ? pipe(fromNullable(e.error), mapOption(left))
      : ctx[id];

    return {
      [id]: value
    } as any;
  });

  const c = <K extends string, V>(key: K, value: V): { [P in K]: V } =>
    ({ [key]: value } as any);

  const assignSuccessOrFailure = assign<Context<L, R, I>, Event<L, R>>(
    (ctx, e): Partial<Context<L, R, I>> => {
      return (isDoneInvokeEvent(e) ? c(id, some(e.data)) : ctx) as {}
    }
      
  );

  const options: MachineOptions<L, R, I> = {
    services: {
      [prefix("submitOperation")]: ((_ctx: Context<L, R, I>, e: Event<L, R>) =>
        isSubmitEvent(e)
          ? e.promiser()
          : Promise.reject("submitService invoked by non-submit event!")) as any
    },
    actions: {
      [prefix('assignInitial')]: assignInitial,
      [prefix("assignSuccessOrFailure")]: assignSuccessOrFailure,
      [prefix("assignError")]: assignError,
    },
    guards: {
      // [prefix("canSubmit")]: params.canSubmit,
    }
  };

  return {
    id,
    config,
    options,
    api
  };
}
