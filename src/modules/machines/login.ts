import { createMachine as createStateMachine } from "xstate";

import { combine } from "../xstate";

import * as usernameConfig from "./username";
import * as passwordConfig from "./password";
import * as operationConfig  from "./login-operator";

export const { config, api, options } = combine("login")(
  usernameConfig,
  passwordConfig,
  operationConfig
);

export const machine = createStateMachine(config, options);
