# Building apps and modules Xassy style

## Intro

TBD

### Folder & file structure

TBD. Modules vs. apps, bla, bla, bla

### The tools we use

TBD

- TypeScript
- React
- XState
- RxJS, observable-hooks
- fp-ts, io-ts
- i18next, i18next-react
- Material Design, RMWC
- SCSS, CSS Modules

### The tools we build

TBD

- Boilerplate
- Code4Code4Developers
- Machine configurations
- Form elements
- Streams
- Modules

### Other strategies & FAQ
TBD
- Single import source of truth for external modules
- Snake case module names
- When to use upper case for file names

## Contact-us: A tutorial on buliding apps in Xassy

In this tutorial we will be be building a _Contact us_ application allowing the user to submit their name, e-mail address and message.

### Stories & Requirements

#### Stories

As an authenticated visitor:

1. I can navigate to a _Contact us_ page or route.
2. Fill out the form and submit it.

#### Requirements

**1. I can navigate to a _Contact us_ page or route.**

- Add a link to the top navigation bar that routes to a new view where the contact form will displayed.
- The contact us link should be disabled if the user is not logged in.

| Copy | Text       |
| ---- | ---------- |
| Link | Contact us |

All copy needs to be displayed in the users preferred language if available.

Make use of the existing infracture and components.

**2. Fill out the form and submit it.**

| Copy                       | Text                                                                           |
| -------------------------- | ------------------------------------------------------------------------------ |
| Link                       | Contact us                                                                     |
| Name label                 | Name                                                                           |
| Name validation            | Name is a required field.                                                      |
| E-mail label               | E-mail                                                                         |
| E-mail required validation | An e-mail is a required.                                                       |
| E-mail invalid validation  | The e-mail is not a valid address.                                             |
| Message label              | Message                                                                        |
| Submit button label        | Submit                                                                         |
| Reset button label         | Reset                                                                          |
| Cancel button label        | Cancel                                                                         |
| Thank you message          | Thank you for contacting us. We will be in touch with you as soon as possible. |
| Failure message            | We were unable to process your request. Please contact us at 1.800.267.2001    |

- All copy needs to be displayed in the users preferred language if available.
- Name and e-mail are required fields
<!-- - The name field should be initialized with the authenticated user's name -->
- Fields and buttons should be disabled while the form is being submitted.
- The user should be able to reset the form effectively clearing all fields.
- Field validation messages should only be displayed after the user has "touched" the controls and they have lost focus.
<!-- - Non-required fields should display a helper text indicating they are optional. -->
- The user can cancel while the form is being submitted.

### Getting started

#### App folder

1. Create a new application folder under `./src/apps` named `xassy-contac-us`. This is were a lot of your code will live. In _Xassy_ apps are self-contained views that can be attached to routes or even other apps. They often don't need any input (props, etc) but do produce some kind of output. The login app e.g. produces _username_, _password_, and _authentication response_..
   <br /><br />
   You are free to organise folders and files inside your application anyway you feel is logical, clean, etc. Avoid deeply nested structures though. More than 3 levels is probably to deep. Just keep the next developer that comes along in mind.

2. Create a blank component that just renders a temporary string message such as "Hello World!" in you app and make it the apps default export in it's _index.ts_ file.

#### Adding a new route

First we need to add a new route to the existing router application. Xassy currently uses a custom build router but in the future we may switch to using other solutions such as _react-router_

In this case our _xassy-router_ app is the application that "knows" about all the other apps that are available. This is a good example of one app composing over multiple other apps.

_import_ your _ContactUsContactUs_ app at the top of `./src/xassy-router/index.tsx` right where it also import the _ContactUsLogin_ app.

Scroll down to the _Route_ component and add a case that will render the _ContactUsContactUs_ app when the user has routed to `/contact-us`

You should also wrap your app using the _Location_ component. This component updates the browsers address bar with the correct url when your app renders.

> Have a look at the _useLocation_ hook. It just a one-liner using React's useEffect hook and the _history_ module's API for updating the address bar

**Accessing the route directly:**

To be able to directly access the route when the browser first loads up the application we need to add an entry to the to _routes_ constant as well. This contant is a mapping of regular expressions used to translate the browers url on load to the proper state.

Update _routes_ with:

```tsx
const routes = [
  .../contact-us/ // New addtion
];
```

We need to also update the state machine configuration that drives the router in `./src/apps/bmd-router/machine.ts`. Each route is essentially a separate state the machine can transition to.

Add a state node the the existing configuration named `contact-us` as well as a target for the `GOTO` event with a condition with the same name.

```ts
export const config = {
  id: "routes",
  ...
  on: {
    GOTO: [
      ...
      { target: ".contact-us", cond: "contact-us" },
      { target: ".404" }
    ]
  },
  states: {
    ...
    'contact-us': {},
    404: {}
  }
};
```

Make sure to not add the new event target after the _not found/404_ target configuration as this is a fallback without a condition. If the state machine is unable to transition to any of the previous targets based on their conditions then it will transition to it's 404 state.

> The requirements state that only authenticated users have access to your app. We'll come back to that later.

Lastly we need to add a link to our top navigation in `./src/apps/xassy/index.tsx`:

```tsx
<Link active={state.matches("contact-us")} to="contact-us">
  Contact Us
</Link>
```

That's it! You should be able to navigate to your app now from any page and see the "Hello World!" message displayed.

#### Wireframing the form

We are now ready to continue developing the ContactUs Contact Us application and it's components. We'll start by replacing _"Hello World!" message with a few React components. But first we're going to put any known copy text inside a \_text.json_ file in components directory of our app. (`./src/apps/xassy-contact-us/components/text.json`).

> Putting copy text inside a JSON file helps us separate that from the components. Plus by using a common file name and type for all copy text we are setting the ourselves up for later success if we need to build or use tools for collecting all the copy our project uses and for exmaple communicate those with translators.

##### Storing copy

Your `text.json` file should look something like this:

```json
{
  "Contact us": "Contact us",
  "Name": "Name",
  "Name is a required field.": "Name is a required field.",
  "E-mail": "E-mail",
  "An e-mail is a required.": "An e-mail is a required.",
  "The e-mail is not a valid address.": "The e-mail is not a valid address.",
  "Message": "Message",
  "Submit": "Submit",
  "Reset": "Reset",
  "Cancel": "Cancel",
  "Thank you for contacting us. We will be in touch with you as soon as possible.": "Thank you for contacting us. We will be in touch with you as soon as possible.",
  "We were unable to process your request. Please contact us at 1.800.267.2001": "We were unable to process your request. Please contact us at 1.800.267.2001"
}
```

To translate text we use the `useTranslation` hook provided by `react-i18next`

```tsx
import { useTranslation } from "react-i18next";
import copy from "./text.json";

const NameLabel = () => {
  const [t] = useTranslation();

  return <Typography use={'subtitle2'}>{t(copy.Name)}</Typography>;
};
```

##### Wireframing the form components

Let's wireframe our app view and form. The main component file for your app should now look like this:

```tsx
import * as React from "react";
import { useTranslation } from "react-i18next";

import Content from "../../../modules/components/Content";
import { FormField } from "../../../modules/components/FormField";

import copy from "./text.json";

const ContactUsContactUs = () => {
  const [t] = useTranslation();

  return (
    <Content>
      <form>
        <FormField>
         <Typography use={'heading6'}>{t("Contact-us")}</Typography>
        </FormField>
        <FormField>
          <Typography use={'subtitle2'}>{t(copy.Name)}</Typography>
          <input />
        </FormField>
        <FormField>
          <Typography use={'subtitle2'}>{t(copy.Email)}</Typography>
          <input />
        </FormField>
        <FormField>
          <Typography use={'subtitle2'}>{t(copy.Message)}</Typography>
          <input />
        </FormField>
      </form>
    </Content>
  );
};

export default ContactUs;
```

We're importing the translation hook and using some of the components already available for building forms.

`FormField` and `Content` provide some basic wireframing for positioning the view and form elements inside them. _Content_ for example renders a loading indicator at the bottom of the page that will animate if you pass the prop `loading={true}` to it. We'll use this later down the road to indicate progress when we submit our form.

### Form elements and form state

#### State management

Xassy apps make a distinction between to types of state. There's data and information state and (component) logical state. Information and dat is stored and shared using observables _(RxJS, BehaviourSubject, Subject)_. This can be form values, API responses, etc.

Component and logical state such as \_"active route", "is the input valid", "is the button disabled" is driven by state machine's and their logic or derived from both.

> **Opinion:** I think this is a really nice approach to state management as state machines really make you think about the application logic and what types of states a component can be in and what states it can transition too. Since XState adheres to the WCSCXML visualizing statecharts can be done at an early stage of the design process whilst being very informative to the developement process.<br /><br />
> Observables make it really easy to share information between apps, routes, modules, components, etc. They also compose very nicely making it easy to build larger pieces of state by combining them or deriving computed state from them.<br /> > _\- John (chautelly)_

And that brings us to further developement of our form. For the fields _name_, _email_, and _message_ we respectively need a state machine that tracks whether those fields are _dirty or pristine_, _valid or invalid_, etc. And a observable stream for each as well.

You have the option to place streams in the app folder itself or if you think that the data your app produces might be important and should be shared (in the future) with other apps or modues then you can also choose to place them in `./src/modules/streams/..`

For this tutorial we are going to place them inside the app folder. And not only that: We are also using some functions that generate state machine controlled components and streams for us! With 2 lines of code you'll have a stream and component for free!

Create a component file for each in your apps' _components_ folder:

```bash
./src/apps/xassy-contact-us/components/Name.tsx
./src/apps/xassy-contact-us/components/Email.tsx
./src/apps/xassy-contact-us/components/Message.tsx
```

Each file's content should look like:

```ts
import { stringInputProvider } from "../../../modules/components/inputProvider";

export const [Email, email$] = stringInputProvider("email");
```

_stringInputProvider_ is the function here that does all the work for us. We'll talk about the inner workings of this in a different post but essentially it takes a `string` that is a name or id for the form element and builds a proper statemachine, Input component, and observable subject for us. If you want to checkout the state machine configuration, it is located in `./src/modules/machiens/input-control/`

Import the _Name_, _Email_, and _Message_ component into your main file:

```tsx
// ./src/apps/xassy-contact-us/components/ContactUsContactUs.tsx
// Libs
import * as React from "react";
import { useTranslation } from "react-i18next";

import Content from "../../../modules/components/Content";
import { FormField } from "../../../modules/components/FormField";
import { Email } from "./Email";
import { Name } from "./Name";
import { Message } from "./Message";

import copy from "./text.json";

const ContactUsContactUs = () => {
  const [t] = useTranslation();

  return (
    <Content>
      <form>
        <FormField>
         <Typography use={'heading6'}>{t("Contact-us")}</Typography>
        </FormField>
        <FormField>
          <Typography use={'subtitle2'}>{t(copy["Name"])}</Typography>
          <Name />
        </FormField>
        <FormField>
          <Typography use={'subtitle2'}>{t(copy["E-mail"])}</Typography>
          <Email />
        </FormField>
        <FormField>
          <Typography use={'subtitle2'}>{t(copy["Message"])}</Typography>
          <Message />
        </FormField>
      </form>
    </Content>
  );
};

export default ContactUsContactUs;
```

At this point the app should render with the three labels and their respective input components. You should be able to type values in the input controls.

### Access control

To block non-authenticated users from accessing the page we need to do two things:

- Disable the _Contact us_ link at the top of the page
- Redirect visitors when they load the page using the _/contact-us_ url.

#### Disable the link

To disable the link we need to know if an authenticated user is available. This can be done using the `isAuthenticated$` observable provided in `./src/modules/streams/authentication/`

_import_ the the observable in `./src/apps/xassy/index.tsx`, the projects main application file and add the following line to it's default component:

```ts
const isAuthenticated = useObservableState(isAuthenticated$, false);
```

`useObservableState` is imported from:

```ts
import { useObservableState } from "observable-hooks";
```

and add a _disabled_ prop to the _Contact Us_' link in the menu:

```tsx
<Link
  active={state.matches("contact-us")}
  to="contact-us"
  disabled={!isAuthenticated}
>
  Contact Us
</Link>
```

Try it out! Refreshing the page should show the link disabled and logging in (which is mocked at this point, eny username/password will do) should enable the link.

#### Redirecting the user

To redirect the user away from the route when they are not authenticated we can use the _Redirect_ component located in `./src/modules/router/components/Redirect` Via React's Context API, this component has access to the router's interpreted state machine's dispatcher to transition the routing state to a different route.

We'll also use the same `isAuthenticated$` stream to conditionally render the _Redirect_ component. Import the hook, stream, and component and add the following to your ContactUs Contact Us application's main component:

```tsx

const ContactUsContactUs = () => {
  const [t] = useTranslation();
  const isAuthenticated = useObservableState(isAuthenticated$, false);

  if (!isAuthenticated) {
    return <Redirect to={'home'} />
  }

  ...

```

This should redirect the user away from the "Contact Us" view when they aren't authenticated.

Before we continue you may want to disable blocking access to not have to re-authenticate on each refresh for now.

### Form validation

A component and stream isn't the only thing the `stringInputProvider` function returns.

```ts
const [InputComponent, value$, isValid$, update, state$] = stringInputProvider(
  "foobar"
);
```

It actually returns a tuple of:

- An component for entering data
- An obeservable of the values produced by the input component
- An observable that streams `true` or `false` depending on the input's validation state.
- And finally an observable to the input's state machine state.

The `isValid$` stream can be used to influence the view in other places based on the input's validity such as rendering a validation message.

To add validation to our _Email_ and _Name_ component we need to passs a few options to `stringInputProvider`:

```tsx
// Email.tsx
import { isEmail } from "../../../modules/utils";

export const [Email, email$, emailIsValid$] = stringInputProvider("email", {
  required: true,
  isValid: isEmail
});

// Name.tsx
export const [Name, name$, nameIsValid$] = stringInputProvider("name", {
  required: true
});
```

The observables that are validation streams can be combined into a single stream later that we can use to enable/disable submit buttons, etc. This also automatically passes the _invalid_ prop to the _Input_ component causing it to style itself with a proper validation state _(error border)_. This partially fullfills the requirement:

> Field validation messages should only be displayed after the user has "touched" the controls and they have lost focus.

Since the state machine that controls the input component essential drives that information.

#### Helper texts

The easiest way to display validation messages with the input components generated by `stringInputProvider` is to pass a render prop. You have the option to pass a child to the componenent that behaves like a render prop rather than a React element.

> For more on render props see the React official documentation: https://reactjs.org/docs/render-props.html

The function passed as a child to the component will receive the following arguments:

- `invalid`: `true` if the component's input is invalid.
- `focused`: `true` if the component has focus.
- `value`: The component's value.

```tsx
<FormField>
  <Typography use={'subtitle2'}>{t(copy["Name"])}</Typography>
  <Name>
    {
      ( { invalid, focused, value } ) => .....
    }
  </Name>
</FormField>
```

In our case, we'd like to render a helper text using the `ValidationHelperText` b component provided by the component library in `./src/modules/components/`.

```tsx
<FormField>
  <Typography use={'subtitle2'}>{t(copy["Name"])}</Typography>
  <Name>
    {({ invalid }) => (
      <ValidationHelperText invalid={invalid}>
        {invalid ? t("A name is required.") : <br />}
      </ValidationHelperText>
    )}
  </Name>
</FormField>
```

Because this becomes quickly unreadable code we'll pull the render props functions out and delclare them outside of the ContactUsContactUs component. We'll also make use of the `ValidationHelperText` component.

```tsx
...
import { useTranslation, UseTranslationResponse } from "react-i18next";

// ..

import ValidationHelperText from "../../../modules/components/input-controls/ValidationHelperText";

// ..

const makeRenderRequiredHelperText = (t: UseTranslationResponse[0]) => (props: {
  invalid: boolean;
}) => (
  <ValidationHelperText {...props}>
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

const ContactUsContactUs = () => {
  const [t] = useTranslation();
  const isAuthenticated = useObservableState(isAuthenticated$, false);

  if (!isAuthenticated) {
    // return <Redirect to={'home'} />
  }

  const renderRequiredHelperText = React.useMemo(
    () => makeRenderRequiredHelperText(t),
    [t]
  );

  const renderEmailHelperText = React.useMemo(
    () => makeRenderEmailHelperText(t),
    [t]
  );
```

The `React.useMemo` hook is used to create a memoized version of the function `props => React.ReactElement` given `t`

With the render props declared outside the component for cleaner composition we can now render:

```tsx
// ...

  <FormField>
    <Typography use={'subtitle2'}>{t(copy["Name"])}</Typography>
    <Name>{renderRequiredHelperText}</Name>
  </FormField>

  <FormField>
    <Typography use={'subtitle2'}>{t(copy["E-mail"])}</Typography>
    <Email>{renderEmailHelperText}</Email>
  </FormField>
```

The helper text for the e-mail field should render a different validation message based on it being empty or non-empty but an invalid address.

### Ready, set, go!

Or _in progress_, _submitting_, _done_

Now that we have everything in place for our input controls we can focus on the state of the form next. As you might expect patterns and boilerplate functions are available to create most things for us.

Create a new file in your app folder: `./src/apps/xassy-contact-us/machine.ts` and place the following code in it:

```ts
import { createMachine } from "../../modules/machines/operator";

const machine = createMachine<false, true>();

export default machine;
```

`"../../modules/machines/operator"` provides us with some boilerplate code that defines a state machine for controlling form state.

Import the machine and add it to the apps main component using the _useMachine_ hoook:

```tsx
// ./src/apps/xassy-contact-us/components/ContactUsContactUs.tsx
import * as E from "fp-ts/lib/Either";
// ...
import { EventType, StateType } from "../../../modules/machines/operator";
import machine from '../machine'
// ...
const ContactUsContactUs = () => {
  // ...
  const [operatorState, send] = useMachine(machine);


```

Let's start with adding a submit button to our form. `./src/modules/components/input-controls/Button` provides a wrapper around  `@rmwc/button`. I like filtering UI components provided by libraries through a custom folder/file structure. That way if the project switches to a different UI theme or libary migrating is much easier since every component imports from the same local source.

```tsx
// ...
const onSubmit = () => {
  const submitEvent = {
    type: EventType.Submit,
    promiser: async () => {
      await delay(2000)
      const response: E.Either<false, true> = E.right(true)

      return response
    }
  }

  send([submitEvent])
}

// ...

    <FormField>
      <Button
         disabled={!operatorState.matches('inProgress')}
        raised
        onClick={onSubmit}
      >
        {t(copy['Submit'])}
      </Button>
    </FormField>
  </form>
</Content>
```

The state machine configuration's SUBMIT event expects a payload _(`.promiser`)_ that contains the function returning a promise. The state machine will then invoke the promise and transition to it's **_done_** state once the promise has resolved. The value the promise resolves with should be of an `Either` type. For now were just using the `right` function imported from `fp-ts/lib/Either` to construct the value.

> A value of type _Either_ can either either be _Left_ or _Right_. If the value is _Left_ then this usually means something went wrong. A _Right_ value indicates the _Either_ "box" contains a good value. Wrapping values in types such as Either and Option forces us to think about cases where values can be null, undefined or when processes fail with certain errors.

Your form should now render the button. However you will notice clicking the button has no effect. This is because the operator state machine is initialized to be in state `inProgress.InValid` and it will ignore the SUBMIT event in that state.

If you'd like to see the button in action and switch to it's disabled state change sending the event to machinet to:

```ts
send([{ type: EventType.Valid }, submitEvent]);
```

This will send 2 events in order and the machine will first transition to `inProgress.Valid` before processing the _SUBMIT_ event.

### Streaming the response

The reponse our promise resolves with is one of those "information states" that we might want to store and share. To do this we are going to add a observable subject to our app. Let's store this varible in `./src/apps/xassy-contact-us/streams.ts`:

```ts
import { BehaviorSubject } from "rxjs";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";

export const contactUsResponse$ = new BehaviorSubject<
  O.Option<E.Either<false, true>>
>(O.none);
```

And update the _onSubmit_ callback to:

```ts
const onSubmit = () => {
  const submitEvent = {
    type: EventType.Submit,
    promiser: async () => {
      await delay(2000);
      const response: E.Either<false, true> = E.right(true);

      contactUsResponse$.next(O.some(response));

      return response;
    }
  };

  send([submitEvent]);
};
```

> You can learn more about _BehaviorSubject_ here: [BehaviourSubject](https://www.learnrxjs.io/learn-rxjs/subjects/behaviorsubject). It is an observable stream that you can both subscribe to and push data in.

Here's what my `ContactUsContactUs.tsx` file looks like by now. I've organised the import statements a little. I tend to follow a pattern of how "far away" imported values are:

```tsx
// ./src/apps/xassy-contact-us/components/ContactUsContactUs.tsx
// Libs
import * as React from "react";
import { useMachine } from "@xstate/react";
import { useTranslation, UseTranslationResponse } from "react-i18next";
import { useObservableState } from "observable-hooks";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";

// Modules
// import Redirect from "../../../modules/router/components/Redirect";
import Content from "../../../modules/components/Content";
import { FormField } from "../../../modules/components/FormField";
import ValidationHelperText from "../../../modules/components/input-controls/ValidationHelperText";
import { EventType } from "../../../modules/machines/operator";
import { isAuthenticated$ } from "../../../modules/streams/authentication";
import { isTruthy } from "../../../modules/utils";
import delay from "../../../modules/utils/delay";

// App modules & components
import machine from "../machine";
import { contactUsResponse$ } from "../streams";
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
const ContactUsContactUs = () => {
  const [t] = useTranslation();
  const isAuthenticated = useObservableState(isAuthenticated$, false);

  const [operatorState, send] = useMachine(machine);

  if (!isAuthenticated) {
    // return <Redirect to={'home'} />
  }

  const renderRequiredHelperText = React.useMemo(
    () => makeRenderRequiredHelperText(t),
    [t]
  );

  const renderEmailHelperText = React.useMemo(
    () => makeRenderEmailHelperText(t),
    [t]
  );

  const onSubmit = () => {
    const submitEvent = {
      type: EventType.Submit,
      promiser: async () => {
        await delay(2000);
        const response: E.Either<false, true> = E.right(true);

        contactUsResponse$.next(O.some(response));

        return response;
      }
    };

    send([{ type: EventType.Valid }, submitEvent]);
  };

  const isInProgress = state.matches;

  return (
    <Content>
      <form>
        <FormField>
         <Typography use={'heading6'}>{t("Contact-us")}</Typography>
        </FormField>

        <FormField>
          <Typography use={'subtitle2'}>{t(copy["Name"])}</Typography>
          <Name>{renderRequiredHelperText}</Name>
        </FormField>

        <FormField>
          <Typography use={'subtitle2'}>{t(copy["E-mail"])}</Typography>
          <Email>{renderEmailHelperText}</Email>
        </FormField>

        <FormField>
          <Typography use={'subtitle2'}>{t(copy["Message"])}</Typography>
          <Message />
        </FormField>

        <FormField>
          <Button
            disabled={!operatorState.matches("inProgress")}
            raised
            onClick={onSubmit}
          >
            {t(copy["Submit"])}
          </Button>
        </FormField>
      </form>
    </Content>
  );
};

export default ContactUsContactUs;
```

### Disabled states

To disable the controls while the form is being submitted we can add a line right before we return:

```ts
const isInProgress = operatorState.matches("inProgress");
```

And add that to the input components:

```tsx
<Name disabled={!isInProgress}> ...
<Email disabled={!isInProgress}> ...
<Message disabled={!isInProgress} />
```

### Using the response

With the response stored in a stream we can use it to display a thank you mesage or error message to the user.

We'll use the `useObservableState` hook provided by `observable-hooks`. Add the top of the component add:

```ts
const response = useObservableState(contactUsResponse$, O.none);
```

And rather than returning the form directly assign it to a variable and remove the usage of the _Content_ component.

```tsx
 const form = (
      <form>
        <FormField>
          ...
```

After the form add:

```tsx
const content = pipe(
  // With the optional response
  response,
  // Fold it into a
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
          constant(<div>{t(copy["We were ..."])}</div>),
          // Or a thank you message if it's Right (true)
          constant(<div>{t(copy["Thank you ..."])}</div>)
        )
      )
  )
);

return (
  <Content loading={operatorState.matches("submitting")}>{content}</Content>
);
```

_constant_ is a function imported from `fp-ts/lib/functions` and turns a value into a "lazy" value, a.k.a a functoin that returns the value. _pipe_ is imported from `fp-ts/lib/pipeable` and allows you to easily chain operations on a value:

```ts
const double = n => n * 2;
const isEven = n % 2 == 0;
const add = x => y => x + y;

isEven(double(add(11)(100)));

// is the same as:

pipe(100, add(11), double, isEven);
```

Cool! Our app should now be displaying a message after 2 seconds once the submit button is clicked.

### Reset

It is unlikely that in the real world you would demand a cancel button for this form but we are using to to demonstrate a problem we'll encounter later.

Change the code in such a fashion that label of the reset button changes to "Cancel" when the form is being submitted.

```tsx
<FormFields horizontal centered>
  <FormField>
    <Button disabled={!isInProgress} raised onClick={onSubmit}>
      {t(copy["Submit"])}
    </Button>
  </FormField>

  <FormField>
    <Button>{t(copy[isInProgress ? "Reset" : "Cancel"])}</Button>
  </FormField>
</FormFields>
```

_FormFields (plural)_ is imported from the same location as _FormField_ and helps styling multiple form fields horizontally. In this case the buttons should be flexed horizontally and centered under the input controls.

To reset the form we need to be able to clear the input fields programmatically. Lucky for us we already have a function for each input that does this for us given by `stringInputProvider`:

```ts
export const [Email, email$, isValid$, update] = stringInputProvider("email", {
  required: true,
  isValid: isEmail
});
```

We can use each components `update` function to send an empty string to their respective streams. Change `Name.tsx` and `Message.tsx` to also export their _update_ function and let's import those functions in our `streams.ts` file and create `reset` updater:

```ts
// ./src/apps/xassy-contact-us/streams.ts
import { BehaviorSubject } from "rxjs";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";

import { update as updateName } from "./components/Name";
import { update as updateEmail } from "./components/Email";
import { update as updateMessage } from "./components/Message";

export const contactUsResponse$ = new BehaviorSubject<
  O.Option<E.Either<false, true>>
>(O.none);

export const reset = () => {
  updateName("");
  updateEmail("");
  updateMessage("");
};
```

Calling the _reset_ function when the user click the "Reset" button should now clear the form:

```tsx
// ./src/apps/xassy-contact-us/components/ContactUsContactUs.tsx
// ...
<FormField>
    <Button
      onClick={reset}
    >
      {t(copy[isInProgress ? "Reset" : "Cancel"])}
    </Button>
  </FormField>
</FormFields>
// ...
```

You'll notice though that if the form fields have been "touched" and are invalid those validation messages remain after resetting. This is because the state machine controlling the input also needs to be reset. This can be done by sending a "ping" event to the `reset$` stream located in `./src/modules/streams/reset`. This file also exports a _reset_ function that can be called to dispatch that event. The state machine created by `stringInputComponent` aleady subscribes to this stream and will reset itself if a message comes through.

```ts
// ./src/apps/xassy-contact-us/streams.ts

// ...

import { reset as pingReset } from "../../modules/streams/reset";

// ...

export const reset = () => {
  updateName("");
  updateEmail("");
  updateMessage("");
  pingReset();
};
```

The state machine driving the form logic also needs to be reset when we press the buttons since we're allowing the user to cancel the submission while it's in progress. At the moment of writing this tutorial we don't have the connection between the operator state machine and the `reset$` stream out-of-the-box yet so we will have to add it ourselves.

```ts
// ./src/apps/xassy-contact-us/machine.ts
import { assign, spawn } from "xstate";
import { mapTo } from "rxjs/operators";

import { createMachine, EventType } from "../../modules/machines/operator";
import { reset$ } from "../../modules/streams/reset";

export const machine = createMachine<false, true>(config => {
  return {
    ...config,
    entry: assign({
      reset$Ref: () => spawn(reset$.pipe(mapTo({ type: EventType.Reset })))
    })
  };
});

export default machine;
```

The `createMachine` function accepts an argument that is a function that will be given the default configuration and allow you make adjustments befor returning it.

In this case we are adding an `entry` configuration to the machine and instructing it to `spawn` an observable (which XState supports) when it enters it's initial state. The observable is of course the `reset$` ping/pong stream and we map it to an event object that is sent back to the state machine.

#### We have a problem

Submit the form and then immediately cancel and see what happens. Yup, once the promise resolves the view still switches to the "Thank you" message. This is a good example of how introducing multiple states (machine context, machine state, and observable streams) will lead to _gotcha's_. The problem here is that we are not letting the state machine control updating the `contactUsResponse$` stream. It's the promise that's sending both a message to the machine that it has resolved as well as pushing data to the stream.

We should put the state machine in charge of updating the stream when it transitions to the _"Done"_ state:

Remove the line `contactUsResponse$.next(O.some(response));` from the `onSubmit` function and change the contents of `machine.ts` to:

```ts
// ./src/apps/xassy-contact-us/machine.ts

import { assign, spawn } from "xstate";
import { mapTo } from "rxjs/operators";
import * as O from "fp-ts/lib/Option";

import {
  createMachine,
  EventType,
  StateType
} from "../../modules/machines/operator";
import { reset$ } from "../../modules/streams/reset";
import { isDoneInvokeEvent } from "../../modules/xstate";

import { contactUsResponse$ } from "./streams";

export const machine = createMachine<false, true>(config => {
  return {
    ...config,
    states: {
      ...config.states,
      [StateType.Done]: {
        entry: "assignDone"
      }
    },
    entry: assign({
      reset$Ref: () => spawn(reset$.pipe(mapTo({ type: EventType.Reset })))
    })
  };
}).withConfig({
  actions: {
    assignDone: (_, evt) =>
      isDoneInvokeEvent(evt) && contactUsResponse$.next(O.some(evt.data))
  }
});

export default machine;
```

We've defined an _entry_ action for the machines _"Done"_ state and are passing the implementation of that action using the `.withConfig` API that XSstate provides for machines.

> If you've gone through the XState documentation then you should know by now that machine configuration should be kept serializable. This allows you to export the machine's configuration and use visualization tools.

### To be valid or not to be valid

The operator machine's _inProgress_ state can be in a _inProgress.Valid_ or _inProgress.Invalid_ substate. To transition the machine into a valid or invalid state you can send it an event of the same name (`.type`).

We would want to dispatch that event every time the validation state of the name or email input changes. This can be achieved by combining the `isValid$` streams returned by by `stringInputProvider` for both:

```ts
// ./src/apps/xassy-contact-us/streams.ts
import { BehaviorSubject, combineLatest } from "rxjs";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";

import { reset as pingReset } from "../../modules/streams/reset";

import {
  update as updateName,
  isValid$ as nameIsValid$
} from "./components/Name";
import {
  update as updateEmail,
  isValid$ as emailIsValid$
} from "./components/Email";
import { update as updateMessage } from "./components/Message";
import { map } from "rxjs/operators";

export const contactUsResponse$ = new BehaviorSubject<
  O.Option<E.Either<false, true>>
>(O.none);

export const isValid$ = combineLatest(nameIsValid$, emailIsValid$).pipe(
  map(([a, b]) => a && b)
);

export const reset = () => {
  updateName("");
  updateEmail("");
  updateMessage("");
  pingReset();
};
```

The `isValid$` streams of both components are imported and composed into a single stream using RxJS' `combineLatest` combinator and `map` operator.

And just like `reset$` the `inValid$` stream can be invoked by the operator state machine when entering it's initial state:

```ts
// ./src/apps/xassy-contact-us/machine.ts
import { assign, spawn } from "xstate";
import { mapTo, map } from "rxjs/operators";
import * as O from "fp-ts/lib/Option";

import {
  createMachine,
  EventType,
  StateType
} from "../../modules/machines/operator";
import { reset$ } from "../../modules/streams/reset";
import { isDoneInvokeEvent } from "../../modules/xstate";

import { contactUsResponse$, isValid$ } from "./streams";

export const machine = createMachine<false, true>(config => {
  return {
    ...config,
    states: {
      ...config.states,
      [StateType.Done]: {
        entry: "assignDone"
      }
    },
    entry: assign({
      // Subscribe to the reset$ signal observable
      reset$Ref: () => spawn(reset$.pipe(mapTo({ type: EventType.Reset }))),
      // Subscribe to the $isValid observable
      isValid$Ref: () =>
        spawn(
          isValid$.pipe(
            map(isValid => ({
              type: isValid ? EventType.Valid : EventType.InValid
            }))
          )
        )
    })
  };
}).withConfig({
  actions: {
    assignDone: (_, evt) =>
      isDoneInvokeEvent(evt) && contactUsResponse$.next(O.some(evt.data))
  }
});

export default machine;
```

> This is an example of how machines can pull in information from other machines without having knowledge of their existance. Using streams also allows u to discard machines and their respective services once the data they have collected is ready.
>
> Alternatively you could also use the actor model to communicate between the operator machine and the input machines or even create a single machine configuration that describes the form state + input states as parallel states.

Before we test our changes we also need to update our `onSubmit` function to **not** send the `IsValid` event.

Let's change it back to:

```ts
send(submitEvent);
```

Though the submit button isn't disabled when the operator machine is in an invalid state, dispatching the _Submit_ event should not affect the form. The state machine simply ignores the event since it does not respond to it when the machine's state is _inProgress.Invalid_.

As a last step, let's import the \_`isValid$` stream into the component and disable the submit button when appropriate.

At this point our main component file should look something like:

```tsx
// ./src/apps/xassy-contact-us/components/ContactUsContactUs.tsx
// Libs
import * as React from "react";
import { useMachine } from "@xstate/react";
import { useTranslation, UseTranslationResponse } from "react-i18next";
import { useObservableState } from "observable-hooks";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { constant } from "fp-ts/lib/function";

// Modules
// import Redirect from "../../../modules/router/components/Redirect";
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
const ContactUsContactUs = () => {
  const [t] = useTranslation();
  const [operatorState, send, operatorService] = useMachine(machine);
  const isAuthenticated = useObservableState(isAuthenticated$, false);
  const response = useObservableState(contactUsResponse$, O.none);
  const isValid = useObservableState(isValid$, false);

  useServiceLogger(operatorService, "contactUs");

  if (!isAuthenticated) {
    // return <Redirect to={'home'} />
  }

  const renderRequiredHelperText = React.useMemo(
    () => makeRenderRequiredHelperText(t),
    [t]
  );

  const renderEmailHelperText = React.useMemo(
    () => makeRenderEmailHelperText(t),
    [t]
  );

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
       <Typography use={'heading6'}>{t("Contact-us")}</Typography>
      </FormField>

      <FormField>
        <Typography use={'subtitle2'}>{t(copy["Name"])}</Typography>
        <Name takeFocus onEnter={onSubmit} disabled={!isInProgress}>
          {renderRequiredHelperText}
        </Name>
      </FormField>

      <FormField>
        <Typography use={'subtitle2'}>{t(copy["E-mail"])}</Typography>
        <Email onEnter={onSubmit} disabled={!isInProgress}>
          {renderEmailHelperText}
        </Email>
      </FormField>

      <FormField>
        <Typography use={'subtitle2'}>{t(copy["Message"])}</Typography>
        <Message onEnter={onSubmit} disabled={!isInProgress} />
      </FormField>

      <FormFields horizontal centered>
        <FormField>
          <Button
            disabled={!isValid || !isInProgress}
            raised
            onClick={onSubmit}
          >
            {t(copy["Submit"])}
          </Button>
        </FormField>

        <FormField>
          <Button onClick={reset}>
            {t(copy[isInProgress ? "Reset" : "Cancel"])}
          </Button>
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

export default ContactUsContactUs;
```

For a better user experience we also added the following prop to our input components:

```tsx
onEnter={onSubmit}
```

Allowing the user to submit the form when pressing the _Enter_ key. _takeFocus_ was added to the `<Name />` component forcing it to take focus when ever it is rendered for the first time.


## API Interaction
We are now done with the UI portion and ready to develop the API interaction.

TBD