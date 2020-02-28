/**
 * @packageDocumentation
 * @module utils
 */

/**
 * ```hs
 * delay :: number -> Promise ()
 * ```
 * 
 * Creates a promise that resolves after n milliseconds. Defaults to 1s.
 * 
 * @param ms Milliseconds to delay the promise by. Defaults to 1s.
 * @returns A promise
 */
export const delay = (milliseconds = 1000) => new Promise(resolve => setTimeout(resolve, milliseconds));

export default delay

