import "./App.scss";

import React, { Suspense } from "react";

import XASSY from "./apps/xassy";
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
      <XASSY />
      <NL />
    </Suspense>
  );
};

export default App;

if (process.env.NODE_ENV === "development") {
  
  /**
   * In dev mode you can press 'x' or 'X' twice quickly
   * to clear the console.
   * 
   * @param event 
   */
  const onKeyPress = (event: KeyboardEvent) => {
    if ([120, 88].includes(event.which)) {
      let didPress = false;

      const onClear = (event2: KeyboardEvent) => {
        didPress = true
        if ([120, 88].includes(event2.which)) {
          console.clear()
        }
      }

      document.addEventListener('keypress', onClear, { once: true })

      setTimeout(() => {
        if (!didPress) {
          document.removeEventListener('keypress', onClear)
        }
      }, 1000)
    }
  }
  
  document.addEventListener("keypress", onKeyPress)

  ;(async function() {
    const reactPckg = await import(
      /* webpackChunkName: "package-versions" */
      "react/package.json"
    );

    const reactDomPckg = await import(
      /* webpackChunkName: "package-versions" */
      "react-dom/package.json"
    );

    console.group("Package Versions");
    console.info("react: %s", reactPckg.version);
    console.info("react-dom: %s", reactDomPckg.version);
    console.groupEnd();
  })();
}
