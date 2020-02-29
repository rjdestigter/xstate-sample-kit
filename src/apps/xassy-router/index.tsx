/**
 * App: Xassy: Router - Example application that implements a basic routing solution combining XState, history, and VanillaTS
 * @packageDocumentation
 * @module app/xassy-router
 * @preferred
 * 
 */

import * as React from "react";

import history from "history/browser";

import { useLocation } from "../../modules/router/hooks";
import { Event } from "./machine";

import Redirect from "../../modules/router/components/Redirect";

// Routed Components
import Login from "../xassy-login";
import ContactUs from "../xassy-contact-us";

export * from "./machine";

// Comonents
const NotFound = () => {
  useLocation("404");
  return <div>404</div>;
};

const Location = (props: { path: string; children: React.ReactNode }) => {
  useLocation(props.path);

  return <>{props.children}</>
};

const Route = ({ state }: { state: any }) => {
  // { state: State<any, any> }) => {
  if (state.matches("home")) {
    return <Redirect to={"login"} />;
  } else if (state.matches("login")) {
    return (
      <Location path={"login"}>
        <Login />
      </Location>
    );
  } else if (state.matches("contactUs")) {
    return (
      <Location path={"contact-us"}>
        <ContactUs />
      </Location>
    );
  } else if (state.matches("404")) {
    return <NotFound />;
  }

  return <Redirect to={"404"} />;
};

const routes = [
  // /users\/(?<userId>\d+)/,
  /login/,
  /signup/,
  /contact-us/
];

const makeGotoEventFromUrl = (rawUrl: string): Event => {
  const url = rawUrl.replace(/^\/|\/$/g, "");

  const { event } = routes.reduce(
    (acc, next) => {
      if (acc.match) {
        return acc;
      } else if (next instanceof RegExp) {
        if (next.test(url)) {
          const outcome = next.exec(url);

          if (outcome) {
            const groups = outcome.groups || {};

            const route = Object.keys(groups)
              .reduce((acc2, key) => {
                const value = groups[key];
                return acc2.replace(`/${value}`, "");
              }, outcome.input)
              .replace(/\//g, ".")
              .replace(/^\.|\.$/, "");

            return { match: true, event: { type: "GOTO", route, ...groups } };
          }
        }
      }

      return acc;
    },
    { match: false, event: { type: "GOTO", route: "home" } }
  );

  return event as Event;
};

export const Router = (props: { send: any; state: any }) => {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const event = makeGotoEventFromUrl(history.location.pathname);
    props.send(event);
    setReady(true);
  }, [props.send]);

  if (!ready) {
    return null;
  }

  return (
    <>
      <Route state={props.state} />
    </>
  );
};

export default Router;
