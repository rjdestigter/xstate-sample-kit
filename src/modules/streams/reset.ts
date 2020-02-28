import { Subject } from 'rxjs'

export const reset$ = new Subject<any>()

export const reset = () => reset$.next()