import * as React from "react";
import { useMachine } from "@xstate/react";

// RMWC
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
  TopAppBarFixedAdjust,
} from "@rmwc/top-app-bar";

import { SendContext } from "../../modules/components/SendContext";
import Button from "../../modules/components/input-controls/Button";

import Router, { machine } from "../xassy-router";
import { useServiceLogger } from "../../modules/xstate";
import Link from "../../modules/router/components/Link";
import { useObservableState } from "observable-hooks";
import { isAuthenticated$ } from "../../modules/streams/authentication";

export default () => {
  const [state, send, service] = useMachine(machine);

  useServiceLogger(service, "xassy.router");
  const isAuthenticated = useObservableState(isAuthenticated$, false);

  return (
    <SendContext.Provider value={{ state, send }}>
      <TopAppBar>
        <TopAppBarRow>
          <TopAppBarSection>
            <TopAppBarTitle>Xassy</TopAppBarTitle>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
      <TopAppBarFixedAdjust />
      <nav className="dark-bg">
        <Link to="home">
          {({ onClick }) => (
            <Button
              icon={'home'}
              theme={state.matches("home") ? ['secondaryBg'] : []}
              onClick={onClick}
              unelevated={state.matches("home")}
              outlined={!state.matches("home")}
            >
              Home
            </Button>
          )}
        </Link>
        <Link to="login">
          {({ onClick }) => (
            <Button
              theme={state.matches("login") ? ['secondaryBg'] : []}
              onClick={onClick}
              unelevated={state.matches("login")}
              outlined={!state.matches("login")}
            >
              Login
            </Button>
          )}
        </Link>
        <Link to="contact-us">
          {({ onClick }) => (
            <Button
            theme={isAuthenticated && state.matches("home") ? ['secondaryBg'] : []}
              onClick={onClick}
              disabled={!isAuthenticated}
              unelevated={state.matches("contactUs")}
              outlined={!state.matches("contactUs")}
            >
              Contact Us
            </Button>
          )}
        </Link>
      </nav>
      <Router send={send} state={state} />
    </SendContext.Provider>
  );
};
