/**
 * @packageDocumentation
 * @module utils
 */

/**
 * Removes the leading and trailing white space and line terminator characters from a string.
 */
export const trim = (value: string) => value.trim()

/**
 * format a string similar to how `console.log('Hello %s',  'World')` works.
 * 
 * Example:
 * 
 * ```ts
 * const Counter = (props: { count: number, total: number }) => {
 *  const [t] = useTranslation()
 * 
 *  return <span>{t('You have %1 messages of which %0 are read.', props.total, props.count)}</span>
 * }
 * ```
 * 
 * @param str The string to be formatted.
 * @param args Any additional arguments are used to replace "variables" within the string.
 */
export const format = (str: string, ...args: any[]) => {
  return str.replace(/%(\d+)/g, (match, number) => { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};
