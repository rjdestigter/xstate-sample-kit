/**
 * @packageDocumentation
 * @module models/user
 */
import * as t from 'io-ts'

/**
 * Runtime type decoder for user models.
 * 
 * Example:
 * 
 * ```ts
 * const fetchUser = async (): Promise<Either<Errors, User>> => {
 *    const response = await fetch("/user/4")
 *    const json = await response.json()
 * 
 *    const userOrError: Either<Errors, User> = User.decode(json)
 * 
 *    return userOrError
 * }
 * ```
 * 
 */
export const User = t.type({
  id: t.number,
  name: t.string,
  username: t.string,
  email: t.string,
}, 'User')

/**
 * User
 * 
 * ```ts
 * type User = {
 *  id: number
 *  name: string
 *  username: string
 *  email: string
 * }
 * ```
 */
export type User = t.TypeOf<typeof User>
