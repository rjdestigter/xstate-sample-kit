import "./App.scss";

import React, { Suspense } from "react";

import LoginApp from "./apps/login";
import { useTranslation } from "react-i18next";

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
      <React.StrictMode>
        <LoginApp />
        <NL />
      </React.StrictMode>
    </Suspense>
  );
};

export default App;
