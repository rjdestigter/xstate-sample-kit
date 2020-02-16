import * as t from 'io-ts'
import { left, Either } from 'fp-ts/lib/Either'
import delay from '../../delay'

export const URL = 'https://jsonplaceholder.typicode.com/users/1'

const User = t.type({
  id: t.number,
  name: t.string,
  username: t.string,
  email: t.string,
})

export type User = t.TypeOf<typeof User>

export type Params = { username: string, password: string}

export const fetchLogin = ({ username, password}: Params) => fetch('https://jsonplaceholder.typicode.com/users/1')

export type FetchedUser = Either<t.Errors | Error, User>

export const fetchUser = async (params: Params): Promise<FetchedUser> => {
  // throw 123;
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


