import * as React from "react";

import classes from "./FormField.module.scss";

import Typography from '../Typography'

export interface PropsFormField {
  label?: React.ReactNode;
  children?: React.ReactNode;
}

export const FormField = (props: PropsFormField) => (
  <div className={classes["form-field"]}>
    {props.label ?? <Typography use={'subtitle2'}>{props.label}</Typography>}
    {props.children}
  </div>
);

interface PropsFormFields {
  horizontal?: boolean;
  centered?: boolean;
  children?: React.ReactNode;
}

export const FormFields = (props: PropsFormFields) => {
  const classNames = []

  props.horizontal && classNames.push(classes["form-fields-horizontal"])
  props.centered && classNames.push(classes["form-fields-centered"])

  return (
    <div className={classNames.join(' ')}>
      {props.children}
    </div>
  );
};
