/**
 * @packageDocumentation
 * @module app/xassy-login
 * 
 */

import * as React from "react";
import { action } from "@storybook/addon-actions";
import { withA11y } from '@storybook/addon-a11y';

import { FormField } from '../../../modules/components/FormField'

import UsernameInputComponent from "./UsernameInput";

export const UsernameInput = () => (
  <div style={{ padding: 10 }}>
    <FormField>
      <UsernameInputComponent
        disabled
        onEnter={action("Pressed enter (disabled)")}
      />
    </FormField>

    <FormField>
      <UsernameInputComponent
        disabled={false}
        onEnter={action("Pressed enter")}
      />
    </FormField>
  </div>
);

export default {
  title: "Apps/Xassy Login/UsernameInput",
  component: UsernameInput,
  decorators: [withA11y]
};
