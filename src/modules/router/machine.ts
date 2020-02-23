
import { createMachine, assign, interpret } from 'xstate'

export type Context = Partial<{ userId: number | undefined }>

export type Event = { type: 'GOTO', route: string  } & Context

export const configuration = {
  id: "routes",
  initial: "home",
  context: {},
  on: {
    GOTO: [
      { target: "home", cond: "home" },
      { target: "users.user", cond: "users.user" },
      { target: "users", cond: "users" },
      { target: "notFound" }
    ]
  },
  states: {
    home: {},
    users: {
      initial: "home",
      states: {
        home: {},
        user: {
          entry: "setUserId",
          exit: "clearUserId"
        }
      }
    },
    notFound: {}
  }
};

export const guards = {
  home: (_: Context, e: Event) => e.route === "home",
  "users.user": (_: Context, e: Event) =>
    e.route === "users" && /^\d+$/.test(`${e.userId || ''}`),
  users: (_: Context, e: Event) => e.route === "users"
}


export const actions = {
  setUserId: assign<Context, Event>({ userId: (_, e) => e.userId }),
  clearUserId: assign<Context, Event>({ userId: (_, __) => undefined }),
}

export const machine = createMachine<Context, Event>(
  configuration,
  { guards, actions }
)


