import { BehaviorSubject } from 'rxjs'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import { Failure } from '../apis/q'
import { User } from '../models/users'

interface AnonymousUser {
  username: string,
  password: string,
}

export const initialAnonymousUser = {
  username: "",
  password: ""
}

export const anonymousUser$ = new BehaviorSubject<AnonymousUser>(initialAnonymousUser);

export const loginOperation$ = new BehaviorSubject<O.Option<E.Either<Failure, User>>>(O.none)