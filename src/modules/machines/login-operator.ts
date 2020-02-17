import { configure } from "./operator";
import { Errors } from "io-ts";

import { User } from "../users/types";

export const { id, config, options, api } =  configure<Errors | Error, User, "status">({
  id: "status"
});