export { default as prefixer } from './prefixer'

export const format = (str: string, ...args: any[]) => {
  return str.replace(/%(\d+)/g, (match, number) => { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};