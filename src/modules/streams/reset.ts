/**
 * @packageDocumentation
 * @module streams/reset
 */
import { Subject } from 'rxjs'

/**
 * Statefull stream that serves as a ping/pong stream. The "state" or messages
 * sent to or subscribed to are ignored. This stream is used by state machines
 * to reset themselves (e.g. cancel a form submission) or other state streams
 * to go back to their intial state (e.g. form text input controls).
 * 
 */
export const reset$ = new Subject<any>()

/**
 * Dispatches a ping event to the [[reset$]] stream.
 */
export const reset = () => reset$.next()