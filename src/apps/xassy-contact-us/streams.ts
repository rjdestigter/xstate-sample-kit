import { BehaviorSubject, combineLatest } from "rxjs";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";

import { reset as pingReset  } from '../../modules/streams/reset'

import { update as updateName, isValid$ as nameIsValid$ } from './components/Name'
import { update as updateEmail, isValid$ as emailIsValid$ } from './components/Email'
import { update as updateMessage } from './components/Message'
import { map } from "rxjs/operators";

export const contactUsResponse$ = new BehaviorSubject<
  O.Option<E.Either<false, true>>
>(O.none);

export const isValid$ = combineLatest(nameIsValid$, emailIsValid$).pipe(
  map(([a, b]) => a && b),
);

export const reset = () => {
  updateName("")
  updateEmail("")
  updateMessage("")
  pingReset()
}
