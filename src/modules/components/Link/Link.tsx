/**
 * @packageDocumentation
 * @module components
 * 
 */
import * as React from 'react'

import classes from './Link.module.scss'

export type PropsLink = JSX.IntrinsicElements['a'] & { active?: boolean; disabled?: boolean }

const Link = (props: PropsLink) => {
  const classNames = [classes.link]
  props.className && classNames.push(props.className);
  props.disabled && classNames.push(classes.disabled); 
  props.active && classNames.push(classes.active);

  const onClick = props.disabled ? () => false : props.onClick

  const clone = {...props}
  delete clone.disabled
  delete clone.active

  return (
    <a {...clone} onClick={onClick} className={classNames.join(' ')}>{props.children}</a>
  )
}

export default Link