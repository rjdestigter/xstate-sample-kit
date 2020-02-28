import * as React from "react";
import { action } from "@storybook/addon-actions";

import { FormField } from "../../../modules/components/FormField";
import { Button } from "../../../modules/components/input-controls/Button";

import LoginFormComponent from "./LoginForm";

const resetButton = <Button onClick={action("Resetting")}>Reset</Button>;

export const LoginForm = () => (
  <LoginFormComponent
    isSubmitting={false}
    canNotSubmit={false}
    onLogin={action("Logging in..")}
    resetButton={resetButton}
  />
);

export const Submitting = () => (
  <LoginFormComponent
    onLogin={action("Logging in..")}
    isSubmitting
    canNotSubmit
    resetButton={resetButton}
  />
);

export const Invalid = () => (
  <LoginFormComponent
    onLogin={action("Logging in..")}
    isSubmitting={false}
    canNotSubmit
    resetButton={resetButton}
  />
);

export default {
  title: "Apps/Xassy Login/LoginForm",
  component: LoginForm
};
