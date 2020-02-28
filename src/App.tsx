import "./App.scss";

import React, { Suspense } from "react";

import XASSY from './apps/xassy'
import { useTranslation } from "react-i18next";

const NL = () => {
  const [, i18n] = useTranslation();

  React.useEffect(() => {
    i18n.changeLanguage("nl");
    setTimeout(() => {
      i18n.changeLanguage("en");
    }, 2500);
  }, [i18n]);

  return null
};

const App: React.FC = () => {
  return (
    <Suspense fallback="...">
        <XASSY />
        <NL />
    </Suspense>
  );
};

export default App;
