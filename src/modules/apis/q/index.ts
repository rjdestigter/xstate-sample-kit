import * as t from "io-ts";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { randomInt } from "fp-ts/lib/Random";
import delay from '../../utils/delay'

import { constant, identity } from "fp-ts/lib/function";

export const URL = "https://jsonplaceholder.typicode.com/users/1";

export type Params = { username: string; password: string };

const ApiFailure = t.type({
  code: t.number,
  error: t.string
});

export type ApiFailure = t.TypeOf<typeof ApiFailure>;

export type Failure =
  | { reason: "api"; error: ApiFailure }
  | { reason: "decode"; error: t.Errors }
  | { reason: "error"; error: Error };

export type QResponse<T> = E.Either<Failure, T>;

const isFailureReason = <R extends Failure["reason"]>(reason: R) => (
  failure: Failure
): failure is Extract<Failure, { reason: R }> => failure.reason === reason;

const createFailure = <R extends Failure["reason"]>(reason: R) => (
  error: Extract<Failure, { reason: R }>["error"]
): Failure => ({ reason, error } as any);

export const createApiFailure = createFailure("api");
export const createDecodeFailure = createFailure("decode");
export const createErrorFailure = createFailure("error");

export const isApiFailure = isFailureReason("api");
export const isDecodeFailure = isFailureReason("decode");
export const isErrorFailure = isFailureReason("error");

if (process.env.NODE_ENV === "development" && process.env.REACT_APP_E2E !== "on") {
  var shuffle = [1, 2, 3, 4];
}

/**
 * Wrapper for making type safe promise based network requests that can fail.
 *
 * @param decoder JSON response decoder created using io-ts
 * @returns A function that takes a function that returns a promise and returns a response.
 */

export const q = <T>(
  decoder: t.Type<T>
): ((promiser: () => Promise<Response>) => Promise<QResponse<T>>) => async (
  promiser: () => Promise<Response>
): Promise<QResponse<T>> => {
  await delay(2000)
  
  try {
    const response = await promiser();
    let json = await response.json();
    console.log(JSON.stringify(json, null, 2));
    if (process.env.NODE_ENV === "development" && process.env.REACT_APP_E2E !== "on") {
      // Iterate through all possible failure cases in development mode
      const i = shuffle.shift();
      i != null && shuffle.push(i);

      if (i === 2) {
        // Simulate ApiFailure
        json = {
          code: randomInt(0, 100)(),
          error: "Invalid username or password"
        };
      } else if (i === 3) {
        // Simulate Error
        throw Error(".. my hands up in the air sometime!");
      } else if (i === 4) {
        // Simulate decoding error
        delete json.username;
      }
    }

    return pipe(
      // Try to decode the incoming JSON with the given type decoder
      decoder.decode(json),
      // Map failure of the decoding process:
      E.mapLeft(
        (decodeError): Failure =>
          pipe(
            ApiFailure.decode(json),
            // First try to decode the json as an ApiFailure
            E.map(createApiFailure),
            // But if that fails keep the initial decoding failure
            E.fold(constant(createDecodeFailure(decodeError)), identity)
          )
      )
    );
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }

    return E.left({
      reason: "error",
      error: error instanceof Error ? error : Error(`${error}`)
    });
  }
};

export default q;
