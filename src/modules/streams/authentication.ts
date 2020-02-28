import { BehaviorSubject, combineLatest } from "rxjs";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import * as R from "fp-ts/lib/Reader";
import { Failure } from "../apis/q";
import { User } from "../models/users";
import { map, filter } from "rxjs/operators";
import { voidward, trim, negate, isNotNull } from "../utils";
import { flow, constant } from "fp-ts/lib/function";
import { dot } from "../fp";
import { reset$ } from "./reset";
import { pipe } from "fp-ts/lib/pipeable";
import { identity } from "io-ts";
// Types
export interface AnonymousUser {
  username: string;
  password: string;
}

export type LoginOutcome = E.Either<Failure, User>;

export type LoginOperation = O.Option<LoginOutcome>;

export type Value<T> = { value: T; robot: boolean };

export const dotValue = dot("value");

export const isRobot = dot("robot");

export const isHuman = negate(isRobot);

// Streams
export const loginOperation$ = new BehaviorSubject<LoginOperation>(O.none);

export const username$ = new BehaviorSubject<Value<string>>({
  value: "",
  robot: true
});

export const password$ = new BehaviorSubject<Value<string>>({
  value: "",
  robot: true
});

export const usernameValue$ = username$.pipe(map(dotValue));
export const passwordValue$ = password$.pipe(map(dotValue));
export const anonymousUser$ = combineLatest(
  usernameValue$,
  passwordValue$
).pipe(map(([username, password]): AnonymousUser => ({ username, password })));

// Getters
export const getLoginOperation = loginOperation$.getValue.bind(loginOperation$);
export const getUsername = flow(username$.getValue.bind(username$), dotValue);
export const getPassword = flow(password$.getValue.bind(password$), dotValue);
export const getAnonymousUser = (): AnonymousUser => ({
  username: getUsername(),
  password: getPassword()
});

// Setters
export const setLoginOperation = voidward(
  loginOperation$.next.bind(loginOperation$)
);

export const resetLoginOperation = setLoginOperation.bind(null, O.none);

export const makeValue = (robot: boolean) => <T>(value: T) => ({
  value,
  robot
});
export const makeHumanValue = makeValue(false);
export const makeRobotoValue = makeValue(true);
export const setUsername = flow(
  trim,
  makeHumanValue,
  voidward(username$.next.bind(username$)),
  dotValue
);
export const setPassword = flow(
  trim,
  makeHumanValue,
  voidward(password$.next.bind(password$)),
  dotValue
);

export const resetUsername = flow(
  trim,
  makeRobotoValue,
  voidward(username$.next.bind(username$)),
  dotValue
).bind(null, "");

export const resetPassword = flow(
  trim,
  makeRobotoValue,
  voidward(password$.next.bind(password$)),
  dotValue
).bind(null, "");

export const resetAnonymousUser = flow(resetUsername, resetPassword);

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
