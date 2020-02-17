import { Option, fold as foldOption } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { constant } from "fp-ts/lib/function";

import { configure } from "./input-control";

export const { id, config, options, api } = configure({
  id: "username",
  isValid: (maybeUsername: Option<string>) =>
    pipe(
      maybeUsername,
      foldOption(constant(false), str => !!str.trim())
    )
});
