import { Option, fold as foldOption } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { constant } from "fp-ts/lib/function";

import { configure } from "./input-control";

export const { id, config, options, api } = configure({
  id: "password",
  isValid: (maybePassword: Option<string>) =>
    pipe(
      maybePassword,
      foldOption(constant(false), str => !!str.trim())
    )
});
