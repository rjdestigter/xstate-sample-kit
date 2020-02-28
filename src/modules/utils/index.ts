export * from './assert'
export * from './getters'
export * from './functions'
export * from './strings'
export * from './booleans'
export { default as prefixer } from './prefixer'

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
