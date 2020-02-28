import * as React from "react";
import { action } from "@storybook/addon-actions";

import { FormField } from '../../../modules/components/FormField'

import PasswordInputComponent from "./PasswordInput";

export const PasswordInput = () => (
  <div style={{ padding: 10 }}>
    <FormField>
      <PasswordInputComponent
        disabled
        onEnter={action("Pressed enter (disabled)")}
      />
    </FormField>

    <FormField>
      <PasswordInputComponent
        disabled={false}
        onEnter={action("Pressed enter")}
      />
    </FormField>
  </div>
);

export default {
  title: "Apps/Xassy Login/PasswordInput",
  component: PasswordInput
};
