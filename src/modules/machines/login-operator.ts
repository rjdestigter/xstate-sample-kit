import { configure } from "./operator";

import  { Failure } from '../apis/q'
import { User } from "../users/types";

export const { id, config, options, api } =  configure<Failure, User, "status">({
  id: "status"
});