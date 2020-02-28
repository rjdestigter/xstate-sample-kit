/**
 * ### Utilities
 * 
 * #### Assertion
 * 
 * - [[isTruthy]]
 * - [[isNotNull]]
 * - [[emailPattern]]
 * - [[isEmail]]
 * 
 * #### Getters
 * 
 * - [[Getter]]
 * - [[getter]]
 * - [[getter2]]
 * - [[getEventCurrentTargetValue]]
 * - [[dot]]
 * - [[dot2]]
 * 
 * #### Functions
 * 
 * - [[forward]]
 * - [[returnSecond]]
 * - [[voidFn]]
 * - [[returnLast]]
 * 
 * #### Strings
 * 
 * - [[trim]]
 * 
 * #### Booleans
 * 
 * - [[negate]]
 * 
 * #### Objects
 * 
 * [[Picker]]
 * [[pick]]
 * 
 * #### Other
 * 
 * - [[delay]]
 * - [[prefixer]]
 * - [[format]]
 * 
 * @packageDocumentation
 * @module utils
 * @preferred
 * 
 * This is the preferred documentation for utils.
 */

export * from './assert'
export * from './getters'
export * from './functions'
export * from './strings'
export * from './booleans'
export * from './objects'
export { default as prefixer } from './prefixer'
export { default as delay } from './delay'

/**
 * format
 * @param str 
 * @param args 
 */
export const format = (str: string, ...args: any[]) => {
  return str.replace(/%(\d+)/g, (match, number) => { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};
