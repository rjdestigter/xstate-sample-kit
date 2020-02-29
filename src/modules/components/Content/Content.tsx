/**
 * @packageDocumentation
 * @module components/Content
 * 
 */
import classes from './Content.module.scss'

import * as React from "react";

import LinearProgress from "../LinearProgress";

/**
 * React prop types for [[Content]]
 */
export interface PropsContent {
  /** Children */
  children: React.ReactNode;
  /** Flag controlling the loading indicator */
  loading?: boolean
}

/**
 * React component used as framework around applications. The component
 * renders a loading indicator at the bottom that can be "turned on" by
 * passing `true` to the [[PropsContent]] `.loading` property.
 * 
 * The component flexes itself to take up as much space as can and child components
 * are rendered inside a flexed container that has `overflow: hidden` applied to it
 * effectively handing over what to do with overflow to the child component(s).
 * 
 */
const Content = (props: PropsContent) => (
  <>
    <div className={classes.content}>{props.children}</div>
    <LinearProgress progress={props.loading ? undefined : 0} />
  </>
);

export default Content