/**
 * ### Streams: Authentication
 * 
 * This module provides a set of streams to manage anonymous- and authenticated user data.
 * 
 * Login forms can use these streams to store username and password and API responses to
 * authentication requests.
 * 
 * #### Types
 * 
 * - [[AnonymousUser]]
 * - [[LoginOutcome]]
 * - [[LoginOperation]]
 * - [[Value]]
 * 
 * #### Functions
 * - [[dotValue]]
 * - [[isRobot]]
 * - [[isHuman]]
 * - [[makeValue]]
 * - [[makeHumanValue]]
 * - [[makeRobotoValue]]
 * 
 * #### Streams
 * - [[loginOperation$]]
 * - [[isAuthenticated$]]
 * - [[username$]]
 * - [[password$]]
 * - [[usernameValue$]]
 * - [[passwordValue$]]
 * - [[anonymousUser$]]
 * - [[user$]]
 * 
 * #### Stream Readers
 * - [[getLoginOperation]]
 * - [[getUsername]]
 * - [[getPassword]]
 * - [[getAnonymousUser]]
 * 
 * #### Stream Updaters
 * - [[setLoginOperation]]
 * - [[resetLoginOperation]]
 * - [[setUsername]]
 * - [[setPassword]]
 * - [[resetUsername]]
 * - [[resetPassword]]
 * - [[resetAnonymousUser]]
 * 
 * @packageDocumentation
 * @module modules/streams/authentication
 */

import { BehaviorSubject, combineLatest } from "rxjs";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { Failure } from "../apis/q";
import { User } from "../models/users/getters";
import { map, filter } from "rxjs/operators";
import { dot, forward, trim, negate, isNotNull } from "../utils";
import { flow, constant } from "fp-ts/lib/function";
import { reset$ } from "./reset";
import { pipe } from "fp-ts/lib/pipeable";
import { identity } from "io-ts";

/**
 * Type representation of the the fields of a login form.
 */
export interface AnonymousUser {
  /** The username  */
  username: string;
  /** The password */
  password: string;
}

/**
 * An authentication request can succeed with a [[User]] or
 * fail with a [[Failure]]
 */
export type LoginOutcome = E.Either<Failure, User>;

/**
 * An authentication operation may or may not be available.
 */
export type LoginOperation = O.Option<LoginOutcome>;

/**
 * Value wrapper for change events. Updates to form values
 * such as the username or password are from the user or
 * by the system itself (reset, initial value, etc.)
 */
export type Value<T> = { value: T; robot: boolean };

/**
 * Getter function for reading the `.value` property of a [[Value]].
 */
export const dotValue = dot("value");

/**
 * Getter function for reading the `.robot` property of a [[Value]].
 */
export const isRobot = dot("robot");

/**
 * Getter function for reading the `.robot` property of a [[Value]] and negating it.
 */
export const isHuman = negate(isRobot);

/**
 * Stream for authentication operations.
 */
export const loginOperation$ = new BehaviorSubject<LoginOperation>(O.none);

/**
 * Stream that operates over [[loginOperation$]] and maps it to a boolean flag if the operation was successful.
 */
export const isAuthenticated$ = loginOperation$.pipe(
  map(maybeResponse =>
    pipe(
      maybeResponse,
      O.map(response => pipe(response, E.fold(constant(false), constant(true)))),
      O.fold(constant(false), constant(true))
    )
  ),
  filter(isNotNull)
);

/**
 * Stream containing a [[Value]] for a username.
 */
export const username$ = new BehaviorSubject<Value<string>>({
  value: "",
  robot: true
});

/**
 * Stream containing a [[Value]] for a password.
 */
export const password$ = new BehaviorSubject<Value<string>>({
  value: "",
  robot: true
});

/**
 * Stream operating over [[username$]] and mapping to it's `.value` property.
 */
export const usernameValue$ = username$.pipe(map(dotValue));

/**
 * Stream operating over [[password$]] and mapping to it's `.value` property.
 */
export const passwordValue$ = password$.pipe(map(dotValue));

/**
 * Stream combining [[usernameValue$]] and [[passwordValue$]] and mapping it to [[AnonymousUser]]
 */
export const anonymousUser$ = combineLatest(
  usernameValue$,
  passwordValue$
).pipe(map(([username, password]): AnonymousUser => ({ username, password })));


/**
 * Get the current value of the [[]loginOperation$] stram.
 */
export const getLoginOperation = loginOperation$.getValue.bind(loginOperation$);

/**
 * Get the current value of the [[username$]] stram. Maps to the streams [[Value]] `.value` property.
 */
export const getUsername = flow(username$.getValue.bind(username$), dotValue);

/**
 * Get the current value of the [[password$]] stram. Maps to the streams [[Value]] `.value` property.
 */
export const getPassword = flow(password$.getValue.bind(password$), dotValue);

/**
 * Get the current value of the [[username$]] and [[password$]] streams as an [[AnonymousUser]]
 */
export const getAnonymousUser = (): AnonymousUser => ({
  username: getUsername(),
  password: getPassword()
});


/**
 * Update the value of the [[loginOperation$]] stream.
 */
export const setLoginOperation = forward(
  loginOperation$.next.bind(loginOperation$)
);

/**
 * Reset the value of the  [[loginOperation$]] stream.
 */
export const resetLoginOperation = setLoginOperation.bind(null, O.none);

/**
 * Wrap a value in a [[Value]] object.
 * @param robot Flag indicating the "author" of the value. This could be the 
 * visitor or user, or a programmatically produced value. E.g. resetting a stream
 * with an empty value.
 */
export const makeValue = (robot: boolean): <T>(value: T) => Value<T> => value => ({
  value,
  robot
});

/**
 * Wrap a value in a [[Value]] object where `.robot` is `false`
 * indicating the value was produced by the user.
 */
export const makeHumanValue = makeValue(false);

/**
 * Wrap a value in a [[Value]] object where `.robot` is `true`
 * indicating the value was produced programatically.
 */
export const makeRobotoValue = makeValue(true);

/**
 * Update the value of the [[username$]] stream.
 */
export const setUsername = flow(
  trim,
  makeHumanValue,
  forward(username$.next.bind(username$)),
  dotValue
);

/**
 * Update the value of the [[password$]] stream.
 */
export const setPassword = flow(
  trim,
  makeHumanValue,
  forward(password$.next.bind(password$)),
  dotValue
);

/**
 * Reset the value of the [[username$]] stream to an empty string
 * and indicate the value was updated programatically.
 */
export const resetUsername = flow(
  trim,
  makeRobotoValue,
  forward(username$.next.bind(username$)),
  dotValue
).bind(null, "");

/**
 * Reset the value of the [[passsword$]] stream to an empty string
 * and indicate the value was updated programatically.
 */
export const resetPassword = flow(
  trim,
  makeRobotoValue,
  forward(password$.next.bind(password$)),
  dotValue
).bind(null, "");

/**
 * Reset the value of the [[username$]] and  [[password$]] stream to an empty string
 * and indicate the value was updated programatically.
 */
export const resetAnonymousUser = flow(resetUsername, resetPassword);

/**
 * Streams the authenticated user. `None`, `Left`, and `null` values
 * are filtered meaning this stream does not have an initial value.
 */
export const user$ = loginOperation$.pipe(
  map(maybeResponse =>
    pipe(
      maybeResponse,
      O.map(response => pipe(response, E.fold(constant(null), identity))),
      O.fold(constant(null), identity)
    )
  ),
  filter(isNotNull)
);

// This is bad. An effect hidden in the code
// TODO Move to the root of the app
reset$.subscribe(flow(resetAnonymousUser, resetLoginOperation));
