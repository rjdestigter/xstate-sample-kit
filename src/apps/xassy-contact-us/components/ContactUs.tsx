/**
 * @packageDocumentation
 * @module app/xassy-contact-us
 * 
 */

 // Libs
import * as React from "react";
import { useMachine } from "@xstate/react";
import { useTranslation, UseTranslationResponse } from "react-i18next";
import { useObservableState } from "observable-hooks";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { constant } from "fp-ts/lib/function";
import { TextFieldHelperText } from '@rmwc/textfield'

// Modules
import Redirect from "../../../modules/router/components/Redirect";
import Button from '../../../modules/components/input-controls/Button'
import Typogrpahy from '../../../modules/components/Typography'
import Content from "../../../modules/components/Content";
import { FormField, FormFields } from "../../../modules/components/FormField";
import ValidationHelperText from "../../../modules/components/input-controls/ValidationHelperText";
import { EventType } from "../../../modules/machines/operator";
import { isAuthenticated$ } from "../../../modules/streams/authentication";
import { isTruthy } from "../../../modules/utils";
import delay from "../../../modules/utils/delay";
import { useServiceLogger } from "../../../modules/xstate";

// App modules & components
import machine from "../machine";
import { contactUsResponse$, isValid$, reset } from "../streams";
import { Email } from "./Email";
import { Name } from "./Name";
import { Message } from "./Message";
import copy from "./text.json";

// Locals
const makeRenderRequiredHelperText = (t: UseTranslationResponse[0]) => (props: {
  invalid: boolean;
  value: string;
}) => (
  <ValidationHelperText
    {...props}
    defaultText={props.value ? `Hi ${props.value}!` : ""}
  >
    {t("This field is required")}
  </ValidationHelperText>
);

const makeRenderEmailHelperText = (t: UseTranslationResponse[0]) => (props: {
  value: string;
  invalid: boolean;
}) => (
  <ValidationHelperText {...props}>
    {isTruthy(props.value)
      ? "A valid e-mail address is required."
      : "This field is required."}
  </ValidationHelperText>
);

// Exports
const ContactUs = () => {
  const [t] = useTranslation();
  const [operatorState, send, operatorService] = useMachine(machine);
  const isAuthenticated = useObservableState(isAuthenticated$, false);
  const response = useObservableState(contactUsResponse$, O.none);
  const isValid = useObservableState(isValid$, false);

  useServiceLogger(operatorService, "contactUs")

  const renderRequiredHelperText = React.useMemo(
    () => makeRenderRequiredHelperText(t),
    [t]
  );

  const renderEmailHelperText = React.useMemo(
    () => makeRenderEmailHelperText(t),
    [t]
  );

  if (!isAuthenticated) {
    // return <Redirect to={'home'} />
  }

  const onSubmit = () => {
    const submitEvent = {
      type: EventType.Submit,
      promiser: async () => {
        await delay(2000);
        const response: E.Either<false, true> = E.right(true);

        return response;
      }
    };

    send(submitEvent);
  };

  const isInProgress = operatorState.matches("inProgress");

  const form = (
    <form style={{ minWidth: "50vw" }}>
      <FormField>
        <Typogrpahy use={'headline4'}>{t("Contact-us")}</Typogrpahy>
      </FormField>

      <FormField>
        <Name label={t(copy["Name"])} takeFocus onEnter={onSubmit} disabled={!isInProgress}>{renderRequiredHelperText}</Name>
      </FormField>

      <FormField>
        <Email label={t(copy["E-mail"])} onEnter={onSubmit} disabled={!isInProgress}>{renderEmailHelperText}</Email>
      </FormField>

      <FormField>
        <Message label={t(copy["Message"])} onEnter={onSubmit} disabled={!isInProgress} />
      </FormField>

      <FormFields horizontal centered>
        <FormField>
          <Button disabled={!isValid || !isInProgress} raised onClick={onSubmit}>
            {t(copy["Submit"])}
          </Button>
        </FormField>

        <FormField>
          <Button onClick={reset}>{t(copy[isInProgress ? "Reset" : "Cancel"])}</Button>
        </FormField>
      </FormFields>
    </form>
  );

  const content = pipe(
    // With the optional response
    response,
    // Fold it into a:
    O.fold(
      // form if there is no response (None)
      constant(form),
      // Other wise, if there is a response
      maybeEither =>
        pipe(
          // With it:
          maybeEither,
          // Fold it into
          E.fold(
            // A sorry message if it's Left (false)
            constant(
              <div>
                {t(
                  copy[
                    "We were unable to process your request. Please contact us at 1.800.267.2001"
                  ]
                )}
              </div>
            ),
            // Or a thank you message if it's Right (true)
            constant(
              <div>
                {t(
                  copy[
                    "Thank you for contacting us. We will be in touch with you as soon as possible."
                  ]
                )}
              </div>
            )
          )
        )
    )
  );

  return (
    <Content loading={operatorState.matches("submitting")}>{content}</Content>
  );
};

export default ContactUs;
