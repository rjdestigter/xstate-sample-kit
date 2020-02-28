import "./App.scss";

import React, { Suspense } from "react";

import LoginApp from "./apps/login";
import { useTranslation } from "react-i18next";

import Router from "./modules/router";

const NL = () => {
  const [, i18n] = useTranslation();

  React.useEffect(() => {
    i18n.changeLanguage("nl");
    setTimeout(() => {
      i18n.changeLanguage("en");
    }, 2500);
  }, [i18n]);

  return null;
};

const App: React.FC = () => {
  return (
    <Suspense fallback="...">
      {/* <React.StrictMode> */}
      <h1>Env: {process.env.REACT_APP_E2E}</h1>

      <LoginApp />
      <NL />
      {/* </React.StrictMode> */}
      <Router />
    </Suspense>
  );
};

export default App;
