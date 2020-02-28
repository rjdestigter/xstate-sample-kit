// Boilerplate
import { stringInputProvider } from "../../../modules/components/inputProvider";
import { isEmail } from "../../../modules/utils";

export const [Email, email$, isValid$, update] = stringInputProvider("email", {
  required: true,
  isValid: isEmail
});
