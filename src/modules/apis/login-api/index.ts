import * as t from 'io-ts'
import { left, Either } from 'fp-ts/lib/Either'

import delay from '../../delay'

import { User } from '../../users/types'

export const URL = 'https://jsonplaceholder.typicode.com/users/1'

export type Params = { username: string, password: string}

export const fetchLogin = (_params: Params) => fetch('https://jsonplaceholder.typicode.com/users/1')

export type FetchedUser = Either<t.Errors | Error, User>

export const fetchUser = async (params: Params): Promise<FetchedUser> => {
  try {
    const response = await fetchLogin(params);
    const json = await response.json()
    // delete json.username;
    await delay(2000)

    return User.decode(json)
  } catch (error) {
    return left(error)
  }
}


