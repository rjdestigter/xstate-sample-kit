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

import { assign, State } from "xstate";

import {
  some,
  Option,
  fromNullable,
  map as mapOption,
  none
} from "fp-ts/lib/Option";

import { prefixer } from "../../utils";
import { Either, left, right } from "fp-ts/lib/Either";
import { isDoneInvokeEvent, isErrorPlatformEvent } from "../../xstate";

/**
 * Raw configuration for input control state machines
 */
export const configuration = <L, R, I extends string>(options: { id: I }) => {
  const { id } = options;

  const prefix = prefixer(id);

  return {
    initial: StateType.InProgress,
    on: {
      [prefix(EventType.Reset)]: {
        target: `${id}.${StateType.InProgress}`,
        actions: prefix("assignInitial")
      }
    },
    states: {
      [StateType.InProgress]: {
        entry: prefix("assignInitial"),
        on: {
          [prefix(EventType.Submit)]: {
            target: StateType.Submitting
          }
        }
      },
      [StateType.Submitting]: {
        invoke: {
          id: prefix("submitOperation"),
          src: prefix("submitOperation"),
          onDone: StateType.Done,
          onError:  StateType.Done
        },
      },
      [StateType.Done]: {
        entry: prefix("assignDone")
      },
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
  type ResetEvent = Extract<Event<L, R>, { type: typeof EventType.Reset }>;

  const { id } = params;

  const prefix = prefixer(id);

  const api: Api<L, R, I> = {
    eventCreators: {
      submit: (promiser: () => Promise<Either<L, R>>): SubmitEvent => ({
        type: prefix(EventType.Submit),
        promiser
      }),
      reset: (): ResetEvent => ({ type: prefix(EventType.Reset) })
    },
    selector: (ctx: Context<L, R, I>) => ctx[id] ?? none
  };

  const isEvent = <E extends Event<L, R>["type"]>(eventType: E) => (
    event: Event<L, R>
  ): event is Extract<Event<L, R>, { type: E }> =>
    event.type === prefix(eventType);

  const isSubmitEvent = isEvent(EventType.Submit);

  const config: MachineConfig<L, R, I> = configuration({ id });

  const assignInitial = assign<Context<L, R, I>, Event<L, R>>(ctx => {
    return {
      [id]: none
    } as any;
  });

  // const assignError = assign<Context<L, R, I>, Event<L, R>>((ctx, e) => {
  //   const value: Option<Either<L, R>> = isFailEvent(e)
  //     ? pipe(fromNullable(e.error), mapOption(left))
  //     : ctx[id];

  //   return {
  //     [id]: value
  //   } as any;
  // });

  const c = <K extends string, V>(key: K, value: V): { [P in K]: V } =>
    ({ [key]: value } as any);

  const assignDone = assign<Context<L, R, I>, Event<L, R>>(
    (ctx, e): Partial<Context<L, R, I>> => {
      if (isErrorPlatformEvent(e)) {
        return c(id, some(left<L, R>(e.data)) as any)
      }

      return (isDoneInvokeEvent(e) ? c(id, some(e.data)) : ctx) as {};
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
      [prefix("assignInitial")]: assignInitial,
      [prefix("assignDone")]: assignDone,
      // [prefix("assignError")]: assignError
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
