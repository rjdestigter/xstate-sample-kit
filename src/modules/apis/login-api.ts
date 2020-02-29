/**
 * ### Module: Login API
 * 
 * Example module for creating authentication requests.
 * 
 * @packageDocumentation
 * @module modules/api/login
 * @preferred
 * 
 */
import { User } from "../models/users/types";

import q from './q'

/**
 * URL of the authentication API
 */
export const URL = "https://jsonplaceholder.typicode.com/users/1";

/**
 * Mandatory parameters sent to the authentication API
 */
export type Params = { username: string; password: string };

/**
 * Sends a authentication request to the server.
 * @param _params Username and password
 */
export const fetchLogin = (_params: Params) =>
  fetch("https://jsonplaceholder.typicode.com/users/1");

/**
 * Sends a authentication request to the server and decodes the response 
 * @param params 
 */
  export const fetchUser = async (params: Params) =>  q(User)(() => fetchLogin(params))