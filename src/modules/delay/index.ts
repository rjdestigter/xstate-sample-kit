/**
 * delay - Create a promise that will resolve after n milliseconds.
 * @param ms Milliseconds to delay the promise by. Defaults to 1s.
 * @returns A promise
 */
export default (milliseconds = 1000) => new Promise(resolve => setTimeout(resolve, milliseconds));

