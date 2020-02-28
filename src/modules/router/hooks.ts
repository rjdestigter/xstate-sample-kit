/**
 * @packageDocumentation
 * @module router
 */
import * as React from 'react'
import history from 'history/browser'

/**
 * React hook for updating the browser's address
 * bar with a location.
 * 
 * Example:
 * 
 * ```tsx
 * const TodosApp = () => {
 *  useLocation('todos')
 * 
 *  <ul>..</ul>
 * }
 * ```
 * 
 * @param path The url or path
 */
export const useLocation = (path: string) => {
  React.useEffect(() => {
    history.push(/^\//.test(path) ? path : `/${path}`);
  }, [path]);
}