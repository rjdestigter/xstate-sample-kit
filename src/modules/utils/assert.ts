/**
 * @packageDocumentation
 * @module utils
 */

 /**
 * ```
 * isTruthy :: a -> boolean
 * ```
 * 
 * Chcecks if a value is truthy. For numberic values
 * `Infinite` and `NaN` are considered non-truthy.
 * 
 * @param value The value to be checked.
 * @typeparam T The type of the value.
 */
export const isTruthy = <T>(value?: T): value is T => {
  if (value) {
    if (typeof value === 'string') {
      return !!value.trim()
    } else if (typeof value === 'number') {
      return !isNaN(value) && value !== Infinity && (value > 0 || value < 0)
    } else if (Array.isArray(value)) {
      return value.length > 0
    }

    return !!value;
  }

  return false
}

/**
 * ```hs
 * isNotNull :: a -> boolean
 * ```
 * 
 * Type guard. Checks if a nullable value is null or not.
 * 
 * @param value The nullable value to be checked.
 * @typeparam T The type of the value
 * @returns Asserts that the value is not of type `null`
 */
export const isNotNull = <T>(value: T | null): value is T => value != null

/**
 * Regular expression for testing e-mail addresses
 */
export const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

/**
 * ```hs
 * isEmail :: String -> Bool
 * ```
 * 
 * Tests a string agains [[emailPattern]] to see if it is a valid e-mail address.
 * 
 * @param email 
 */
export const isEmail = (email?: string) => isTruthy(email) && emailPattern.test(email)