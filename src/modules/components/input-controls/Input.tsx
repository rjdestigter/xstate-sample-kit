// import '@material/textfield/mdc-text-field.scss';
// import '@material/floating-label/mdc-floating-label.scss';
// import '@material/notched-outline/mdc-notched-outline.scss';
// import '@material/line-ripple/mdc-line-ripple.scss';
import * as React from 'react'

import { TextField } from '@rmwc/textfield'
import { PropsOf } from '../../types';

export * from "@rmwc/textfield";

export type PropsInput = PropsOf<typeof TextField> & {
  takeFocus?: any;
  onEnter?: () => void;
}

export const Input = (props: PropsInput) => {
  // Ref
  const ref = React.useRef<HTMLInputElement | null>(null);

  // Hooks
  React.useLayoutEffect(() => {
    props.takeFocus && ref.current && ref.current.focus();
  }, [props.takeFocus]);
  
  const onKeyPress = React.useMemo(() => (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.which === 13 && props.onEnter) {
      debugger
      props.onEnter()
    } else if (props.onKeyPress) {
      props.onKeyPress(evt)
    }
  }, [props.onEnter, props.onKeyPress])

  // pROPS
  const { takeFocus, onEnter, ...textFieldProps } = props

  return (
    <TextField {...textFieldProps} inputRef={ref} onKeyPress={onKeyPress} />
  )
}

export default Input
