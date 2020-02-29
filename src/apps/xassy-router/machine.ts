/**
 * @packageDocumentation
 * @module app/xassy-router
 * 
 */
import { createMachine } from "xstate";

export type GOTO = "GOTO";
export type Context = {} // Partial<{ userId: number | undefined }>
export type Event = { type: GOTO, route: string  } & Context

export const GOTO: GOTO = "GOTO"

export const config = {
  id: "routes",
  initial: "home",
  context: {},
  on: {
    GOTO: [
      { target: ".home", cond: "home" },
      { target: ".login", cond: "login" },
      { target: ".signup", cond: "signup" },
      { target: ".contactUs", cond: "contactUs" },
      { target: ".404" }
    ]
  },
  states: {
    home: {},
    signup: {},
    login: {},
    contactUs: {},
    404: {}
  }
};

export const guards = {
  home: (_: Context, e: Event) => e.route === "home",
  login: (_: Context, e: Event) => e.route === "login",
  signup: (_: Context, e: Event) => e.route === "signup",
  contactUs: (_: Context, e: Event) => e.route === "contact-us",
}


export const actions = {
}

export const machine = createMachine(config, { actions, guards })
