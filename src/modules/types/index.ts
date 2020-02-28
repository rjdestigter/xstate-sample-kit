/**
 * @packageDocumentation
 * @module types
 */

/**
 * From a tuple type drop the first element.
 * 
 * Example:
 * 
 * ```ts
 * type Triple = [string, number, boolean]
 * 
 * type NrBoolTuple = DropFirstInTuple<Triple>
 * ```
 * 
 * @typeparam TTuple The type of the given tuple type.
 */
export type DropFirstInTuple<TTuple extends any[]> = ((...args: TTuple) => any) extends (arg: any, ...rest: infer U) => any ? U : TTuple;

/**
 * Extract the props type from a React components.
 * 
 * Example:
 * 
 * ```ts
 * const Toggle = (props: { on: boolean }) => <checkbox checked={props.on} />
 * 
 * type PropsToggle = PropsOf<typeof Toggle>
 * ```
 * 
 * @typeparam TComponent The type of a React components.
 */
export type PropsOf<TComponent extends React.ComponentType<any>> = TComponent extends React.ComponentType<infer P>
  ? P
  : never;

/**
 * Type alias of the change event dispatched by the Atmoic UI Library's
 * `a-input' web component.
 */
  export type InputEvent = React.FormEvent<HTMLInputElement>;

/**
 * Convert a tuple type to a union type.
 * 
 * Example:
 * 
 * ```ts
 * type NumberAndString = [number, string]
 * 
 * type NumberOrString = NeededUnionType<Tuple>
 * ```
 * 
 * @typeparam TTuple The tuple type to be converted.
 */
export type NeededUnionType<TTuple extends any[]> = TTuple[number]