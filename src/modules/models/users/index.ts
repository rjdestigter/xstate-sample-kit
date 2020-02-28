/**
 * Model: User
 * @packageDocumentation
 * @module user
 * @preferred
 */
import { getter } from '../../utils'

export * from './types'

/**
 * Given a [[User]] returns it's id
 * 
 */
export const getId = getter('id')

/**
 * Given a [[User]] returns it's username
 * 
 */
export const getUsername = getter('username')
