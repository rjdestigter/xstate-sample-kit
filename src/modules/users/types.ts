import * as t from 'io-ts'

export const User = t.type({
  id: t.number,
  name: t.string,
  username: t.string,
  email: t.string,
}, 'User')

export type User = t.TypeOf<typeof User>
