import * as React from 'react'
import { Subject } from 'rxjs'
import * as O from 'fp-ts/lib/Option'

export const useSubject = <T, S extends Subject<O.Option<T>>>(subject$: S, next: T) => {
  subject$.next(O.some(next));
  
  React.useEffect(() => () => subject$.next(O.none), [subject$]);
}