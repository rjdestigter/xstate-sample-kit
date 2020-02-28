/**
 * ## q
 *
 * Wrapper around `fetch` for type safe network requests
 * using `io-ts` and `fp-ts` utilities and types.
 *
 * ### Example
 *
 * ```ts
 * import * as t from 'io-ts'
 *
 * const User = t.type({
 *   id: t.number,
 *   name: t.string,
 *   username: t.string,
 *   email: t.string,
 * }, 'User')
 *
 *
 * const requestUserById = (id: number): Promise<Response> => fetch('http://www.example.com/api/v1/user/' + id)
 *
 * const fetchUserById= (id: number): Promise<Either<Failure, User>>
 *    => q(User)(() => requestUserById(id))
 *
 * const result: Either<Failure, User> = await fetchUserById(334)
 * ```
 * 
 * The [[Failure]] type describes three possible ways a network request can fail:
 * 
 * - Reason: "api", The response shape matched some pre-determined protocol for communicating error messages.
 * - Reason: "decode", The decoder was unable to parse the response indicating bad data.
 * - Reason: "error", Something went really wrong, bug in the code, network down, etc.
 * 
 * ```
 *
 * @packageDocumentation
 * @module q
 * @preferred
 */

import * as t from "io-ts";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { randomInt } from "fp-ts/lib/Random";
import delay from "../../utils/delay";

import { constant, identity } from "fp-ts/lib/function";

/**
 * Runtime type decoder for parsing API failure responses.
 */
const ApiFailure = t.type({
  code: t.number,
  error: t.string
});

/**
 *  Describes a standarized API failure reponse.
 *
 * ```ts
 * type ApiFailure = {
 *   code: number
 *   error: string
 * }
 * ```
 */
export type ApiFailure = t.TypeOf<typeof ApiFailure>;

/**
 * Type literal describing the reason of a network request failure.
 */
export type ReasonApi = "api";

/**
 * Constant of the type literal with the same name. See [[ReasonApi]]
 */
export const ReasonApi: ReasonApi = "api";

/**
 * Type literal describing the reason of a network request failure.
 */
export type ReasonDecode = "decode";

/**
 * Constant of the type literal with the same name. See [[ReasonDecode]]
 */
export const ReasonDecode: ReasonDecode = "decode";

/**
 * Type literal describing the reason of a network request failure.
 */
export type ReasonError = "error";

/**
 * Constant of the type literal with the same name. See [[ReasonError]]
 */
export const ReasonError: ReasonError = "error";

/**
 * Union of type literals describing the reasons a netowrk request may fail with.
 */
export type Reason = ReasonApi | ReasonDecode | ReasonError;

/**
 * A network request can fail due to:
 *
 * #### Reason: "api"
 *
 * This type of failure describes an API response with
 * failure information following a specific protocol. For
 * example a bad username or password or maybe  the database
 * connection failed.
 *
 * `t.Errors` is the error response provided by `io-ts`
 *
 * ```ts
 * { reason: "api"; error: t.Errors }
 * ```
 *
 * #### Reason: "error"
 *
 * An error type for all other cases. Usually when a there is
 * a bug in the code or the network is down.
 *
 * ```ts
 * { reason: "error"; error: Error }
 * ```
 *
 */
export type Failure =
  /** The network returns a reponse decribing an error. */
  | { reason: ReasonApi; error: ApiFailure }
  /** The type decoder failed to parse the response. (Bad data) */
  | { reason: ReasonDecode; error: t.Errors }
  /** A critical error occurred (Netork down) */
  | { reason: ReasonError; error: Error };

/**
 * The reponse type for this module. It is either
 * a "Right" response of TModel or a "Left" of some type of [[Failure]]
 */
export type QResponse<TModel> = E.Either<Failure, TModel>;

/**
 * Asserts a [[Failure]] value of a specific reason type.
 *
 * @param reason "api", "decode", or "failure"
 */
const isFailureReason = <R extends Reason>(reason: R) => (
  failure: Failure
): failure is Extract<Failure, { reason: R }> => failure.reason === reason;

/**
 * Make a function for creating failure objects of type [[Failure]] of speicifc reason.
 *
 * @internal
 * @param reason "api", "decode", or "failure"
 */
const makeCreateFailure = <R extends Reason>(reason: R) => (
  error: Extract<Failure, { reason: R }>["error"]
): Failure => ({ reason, error } as any);

/**
 * Create a [[Failure]] object with reason: "api"
 */
export const createApiFailure = makeCreateFailure(ReasonApi);
/**
 * Create a [[Failure]] object with reason: "decode"
 */
export const createDecodeFailure = makeCreateFailure(ReasonDecode);
/**
 * Create a [[Failure]] object with reason: "error"
 */
export const createErrorFailure = makeCreateFailure(ReasonError);

/**
 * Asserts that a given [[Failure]] object is of reason: "api"
 */
export const isApiFailure = isFailureReason(ReasonApi);

/**
 * Asserts that a given [[Failure]] object is of reason: "decode"
 */
export const isDecodeFailure = isFailureReason(ReasonDecode);

/**
 * Asserts that a given [[Failure]] object is of reason: "error"
 */
export const isErrorFailure = isFailureReason(ReasonError);

/**
 * Functon that takes a lazy promise of a network response and returns
 * a promise of a [[QResponse]]
 */
export type QFetch<TModel> = (
  promiser: () => Promise<Response>
) => Promise<QResponse<TModel>>;

/**
 *
 */
export type Q = <TModel>(decoder: t.Type<TModel>) => QFetch<TModel>;

/**
 * Wrapper for making type safe promise based network requests that can fail.
 *
 * @param decoder JSON response decoder created using io-ts
 * @returns A function that takes a function that returns a promise and returns a response.
 */
export const q: Q = <TModel>(decoder: t.Type<TModel>): QFetch<TModel> => {
  /**
   * Mock failure reasons
   * Code is tree-shaken in production builds:
   */
  if (
    process.env.REACT_APP_DISABLE_Q_SHUFFLE !== "TRUE" &&
    process.env.NODE_ENV === "development" &&
    process.env.REACT_APP_E2E !== "on"
  ) {
    var shuffle = [1, 2, 3, 4];
  }

  return async (
    promiser: () => Promise<Response>
  ): Promise<QResponse<TModel>> => {
    await delay(2000);

    try {
      const response = await promiser();
      let json = await response.json();

      /**
       * Mock failure reasons
       * Code is tree-shaken in production builds:
       */
      if (
        process.env.REACT_APP_DISABLE_Q_SHUFFLE !== "TRUE" &&
        process.env.NODE_ENV === "development" &&
        process.env.REACT_APP_E2E !== "on"
      ) {
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
      /**
       * End of Mock failure reasons
       */

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

      return E.left(
        createErrorFailure(error instanceof Error ? error : Error(`${error}`))
      );
    }
  };
};

export default q;
