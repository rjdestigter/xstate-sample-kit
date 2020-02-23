import { User } from "../../models/users/types";

import q from '../q'

export const URL = "https://jsonplaceholder.typicode.com/users/1";

export type Params = { username: string; password: string };

export const fetchLogin = (_params: Params) =>
  fetch("https://jsonplaceholder.typicode.com/users/1");

export const fetchUser = async (params: Params) =>  q(User)(() => fetchLogin(params))