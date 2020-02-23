export const foo = 'bar'
// import { Observable, Subject } from 'rxjs'
// import { Functor2 } from 'fp-ts/lib/Functor'

// import { pipe } from 'rxjs'
// import { map as mapStream } from 'rxjs/operators'

// export const URI = 'BehaviorSubject'  

// export type IO$<I, O> = [(next: I) => void, Observable<O>]

// export type URI = typeof URI

// declare module 'fp-ts/lib/HKT' {
//   interface URItoKind2<E, A> {
//     IO$: IO$<E, A>
//   }
// }

// export const fromSubject = <T>(subject: Subject<T>): IO$<T, T> => [
//   value => subject.next(value),
//   subject
// ]

// export const map = <A, B>(f1: (a: A) => B, f2: (b: B) => A) => ([next, $]: IO$<A, A>):IO$<B, B> =>  [next, $.pipe(mapStream(f))]

// // functor instance for `Response`
// export const functorResponse: Functor2<URI> = {
//   URI,
//   map
// }