import * as React from 'react'

const OrNbsp = (props: { predicate: boolean, children: React.ReactNode }) => (
  <span>{props.predicate ? props.children : "\u00A0"}</span>
)

export default OrNbsp